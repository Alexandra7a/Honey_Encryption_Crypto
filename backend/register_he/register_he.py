import hashlib
import json
import os
import random
from typing import Dict, List, Tuple, Optional
import uuid

from pydantic import BaseModel,  EmailStr
from pydantic_extra_types.payment import PaymentCardNumber, PaymentCardBrand
from typing import List, Optional
import base64

class CardInfo(BaseModel):
    name: str
    card_number: PaymentCardNumber
    cvv: str
    expiration_date: str   
    @property
    def brand(self) -> PaymentCardBrand:
        return self.card_number.brand 
    def validate_cvv(cls, v) -> str:
        brand = cls._brand
        if not v.isdigit():
            raise ValueError("CVV must be numeric")
        if brand == PaymentCardBrand.american_express:
            if len(v) != 4:
                raise ValueError("AMEX CVV must be 4 digits")
        else:
            if len(v) != 3:
                raise ValueError("CVV must be 3 digits")
        return v
    
class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    card_info: CardInfo

class UserDatabaseRecord(BaseModel):
    """Separate model for database storage"""
    username: str
    salt: bytes
    hashed_sweetwords: List[str]
    user_data_list: List[Dict]
    real_index: int
    failed_attempts: List[Dict]


class HoneyLoginSystem:
    """
    Honey Login System - Wrong passwords produce plausible fake user sessions
    
    Key Concept:
    - Each user has 1 real password + N honeywords (fake passwords)
    - All passwords "work" and return user data
    - Only the system knows which password is real (via sweetword_index)
    - Wrong password = fake session + silent alert to admin
    """
    
    def __init__(self, num_honeywords: int = 19):
        """
        Args:
            num_honeywords: Number of fake passwords per user (default 19 = 20 total with real one)
            honey_data_file: Path to JSON file containing fake user data
        """
        self.num_honeywords = num_honeywords
        
    def _generate_fake_user_data(self, real_data: Dict, seed:int) -> Dict:
        """Generate plausible fake user data"""
        from backend.register_he.honey_generator import generate_honey_data
        random.seed(seed)
        # result = generate_honey_data(self.num_honeywords,real_data=real_data)
        # fake_data = random.choice(result).copy()  
        result = generate_honey_data(1,real_data=real_data)
        fake_data = result[0].copy() 
        random.seed()  # Reset seed       
        return fake_data
        
    def _hash_password(self, password: str, salt: bytes) -> str:
        """Hash a password with salt"""
        return hashlib.sha256(password.encode() + salt).hexdigest()
    
    def register_user(self, user: User) -> Dict:
        """
        Register a new user with honey encryption protection
        
        Args:
            user: User object with full_name, email, password, card_info
            
        Returns:
            Registration status info
        """
        username = user.email  # Use email as username
        
        if self.find_user_in_database(username) is not None:
            return {"success": False, "error": "User already exists"}
        
        # Generate salt for this user
        salt = os.urandom(16)
        
        # Create real user data
        user_data = {
            "account_ID": str(uuid.uuid4()),
            "full_name": user.full_name,
            "email": user.email,
            "card_number": str(user.card_info.card_number),
            "card_name": user.card_info.name,
            "cvv": user.card_info.cvv,
            "expiration_date": user.card_info.expiration_date,
            "card_type": user.card_info.brand
        }
        
        # Create sweet_word list: real password + honey_words
        sweet_words = [user.password]
        
        # Generate honey_words (fake passwords)
        for _ in range(self.num_honeywords):
            honey_word = self._generate_honeyword(user.password)
            sweet_words.append(honey_word)
        
        # Shuffle so real password position is random
        real_password_index = random.randint(0, len(sweet_words) - 1)
        sweet_words.insert(real_password_index, sweet_words.pop(0))  # Move real password to random position
        
        # Hash all sweet_words
        hashed_sweet_words = [self._hash_password(sw, salt) for sw in sweet_words]
        
        # Generate fake user data for each honey_word
        fake_data_list = [user_data]  # Index 0 = real data initially
        for _ in range(self.num_honeywords):
            fake_data_list.append(self._generate_fake_user_data(user_data))
        
        # Shuffle fake data to match sweet_word positions
        fake_data_list.insert(real_password_index, fake_data_list.pop(0))
        db_record = UserDatabaseRecord(
            username=username,
            salt=salt,
            hashed_sweetwords=hashed_sweet_words,
            user_data_list=fake_data_list,
            real_index=real_password_index,
            failed_attempts=[]
        )
        response = self.save_user_to_database(record=db_record)
        if not response['success']:
            return response
                        
        return {
            "success": True, 
            "message": f"User {username} registered with {len(sweet_words)} password variants",
            "warning": f"Real password is at index {real_password_index} (system only knows this)"
        }
    
    def _generate_honeyword(self, real_password: str) -> str:
        """Generate a plausible fake password"""
        variations = [
            real_password + str(random.randint(0, 99)),  # Add numbers
            real_password.capitalize(),  # Capitalize
            real_password + random.choice(['!', '@', '#', '$']),  # Add special char
            real_password[::-1],  # Reverse
            real_password.replace('a', '@').replace('e', '3').replace('i', '1'),  # Leetspeak
            ''.join(random.choices(real_password, k=len(real_password))),  # Scramble
        ]
        print(f"Generated honeyword variations for '{real_password}': {variations}")
        return random.choice(variations)
    
    def login(self, username: str, password: str) -> Tuple[bool, Optional[Dict], Dict]:
        """
        Attempt login - ALWAYS returns data (real or fake)
        
        Args:
            username: Username
            password: Password attempt
            
        Returns:
            Tuple of:
            - is_real_password (bool): True if correct password (system knows, user doesn't)
            - user_data (Dict or None): User data (real or fake)
            - metadata (Dict): Login metadata
        """
        user_record = self.find_user_in_database(username)
        if user_record is None:
            return False, None, {"error": "User not found"}
        
        salt = user_record['salt']
        hashed_attempt = self._hash_password(password, salt)
        
        # Find which sweetword matches
        matching_index = None
        for i, hashed_sw in enumerate(user_record['hashed_sweetwords']):
            if hashed_sw == hashed_attempt:
                matching_index = i
                break
        
        if matching_index is None:
            return False, None, {"error": "Invalid password"}
        
        # Check if this is the real password
        is_real = (matching_index == user_record['real_index'])
        
        # Return corresponding user data (real or fake)
        user_data = user_record['user_data_list'][matching_index]
        
        # Log the attempt
        if not is_real:
            user_record['failed_attempts'].append({
                'password_used': password,
                'sweetword_index': matching_index,
                'timestamp': 'now'  # In real system, use actual timestamp
            })
            # In real system: ALERT ADMIN - attacker used honeyword!
            print(f"⚠️  SECURITY ALERT: User {username} logged in with HONEYWORD (index {matching_index})")
        
        metadata = {
            "username": username,
            "is_real_password": is_real,
            "sweetword_index_used": matching_index,
            "total_failed_attempts": len(user_record['failed_attempts'])
        }
        
        return is_real, user_data, metadata
    
    def save_user_to_database(self, record: UserDatabaseRecord, filename: str = "honey_users.json"):
        """Save user to file"""
        try:
            # Convert bytes to hex for JSON serialization
            db_serializable = {
                'username': record.username,  # Changed from record['username']
                'salt': record.salt.hex(),  # Changed from record['salt'].hex()
                'hashed_sweetwords': record.hashed_sweetwords,  # Changed
                'user_data_list': record.user_data_list,  # Changed
                'real_index': record.real_index,  # Changed
                'failed_attempts': record.failed_attempts  # Changed
            }
            with open(filename, 'w') as f:
                json.dump(db_serializable, f, indent=2)
            return {"success": True, "message": f"User {record.username} saved to {filename}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def find_user_in_database(self, username: str, filename: str = "honey_users.json") -> Optional[UserDatabaseRecord]:
        """Find user in file"""
        try:
            with open(filename, 'r') as f:
                content = f.read().strip()
                if not content:
                    return None
                db_serializable = json.loads(content)
            if db_serializable['username'] == username:
                # Convert hex back to bytes
                user_record = UserDatabaseRecord(
                    username=db_serializable['username'],
                    salt=bytes.fromhex(db_serializable['salt']),
                    hashed_sweetwords=db_serializable['hashed_sweetwords'],
                    user_data_list=db_serializable['user_data_list'],
                    real_index=db_serializable['real_index'],
                    failed_attempts=db_serializable['failed_attempts']
                )
                return user_record
            return None
        except FileNotFoundError:
            return None
        



if __name__ == "__main__":
    from faker import Faker
    fake = Faker()
    
    # Generate a valid card number using faker
    valid_card = fake.credit_card_number(card_type='mastercard')
    
    demo_user=User(
        full_name="Alice Example",
        email="alice@example.com",
        password="SecurePass123!",
        message="This is a secret message.",
        card_info=CardInfo(
            name="Alice Example",
            card_number=valid_card,  # Luhn-valid card number
            cvv="123",
            expiration_date="09/29",
            brand=PaymentCardBrand.mastercard
        )
    )
    honey_system = HoneyLoginSystem(num_honeywords=4)
    registration_result = honey_system.register_user(demo_user)
    print("\n" + "=" * 70)
    print("REGISTRATION RESULT:")
    print("=" * 70)
    print(json.dumps(registration_result, indent=2))
    
    # Show what was generated
    print("\n" + "=" * 70)
    print("CHECKING SAVED DATA:")
    print("=" * 70)
    try:
        with open("honey_users.json", "r") as f:
            saved_data = json.load(f)
            print(f"User: {saved_data['username']}")
            print(f"Total password variants: {len(saved_data['hashed_sweetwords'])}")
            print(f"Real password index: {saved_data['real_index']}")
            print(f"\nAll data variants:")
            for idx, data in enumerate(saved_data['user_data_list']):
                is_real = (idx == saved_data['real_index'])
                print(f"\n  Variant #{idx} {'[REAL]' if is_real else '[FAKE]'}:")
                print(f"    Email: {data.get('email')}")
                print(f"    Card: {data.get('card_number')}")
                print(f"    Account ID: {data.get('account_ID', 'N/A')}")
    except FileNotFoundError:
        print("No saved data found.")
