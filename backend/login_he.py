import hashlib
import json
import os
import random
from typing import Dict, List, Tuple, Optional
import uuid
from anyio import sleep
from pydantic import BaseModel,  EmailStr
from pydantic_extra_types.payment import PaymentCardNumber, PaymentCardBrand
from typing import List, Optional
import base64

DB_USER_FILE = "database/minimal_honey_users.json"
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
    password: str
    email: EmailStr
    card_info: CardInfo

class MinimalUserDatabaseRecord(BaseModel):
    """Separate model for database storage"""
    username: str
    salt: bytes
    hashed_password: str
    real_user_data: Dict
    
class HoneyLoginSystem:
    """
    Honey Login System - Wrong passwords produce plausible fake user sessions
    """
    
    def _generate_fake_user_data(self, real_data: Dict, seed:int) -> Dict:
        """Generate plausible fake user data"""
        from backend.register_he.honey_generator import generate_honey_data
        random.seed(seed) 
        result = generate_honey_data(1,real_data=real_data)
        fake_data = result[0].copy() 
        random.seed()  # Reset seed       
        return fake_data
    
    def generate_fake_user_data(self,real_data: Dict, seed: int) -> Dict:
        from faker import Faker
        import datetime
        fake = Faker()
        Faker.seed(seed)
        random.seed(seed)

        # Brand consistency
        try:
            brand = PaymentCardNumber(real_data["card_number"]).brand.value
            if brand not in ["visa", "mastercard", "discover", "jcb"]:
                brand = "mastercard"
        except Exception:
            brand = "mastercard"

        balance_int = random.randint(50, 15000)
        balance_cents = random.randint(10, 99)

        fake_year = datetime.date.today().year + random.randint(3, 6)
        end_date = datetime.date(fake_year, 12, 31)
        first_name = real_data.get("full_name", '').split()[0]
        last_name = fake.last_name()
        full_name = f"{first_name} {last_name}"
        return {
            "account_ID": fake.uuid4(),
            "full_name": full_name,
            "email": f"{first_name.lower()}.{last_name.lower()}@{fake.free_email_domain()}",
            "card_number": fake.credit_card_number(card_type=brand),
            "cvv": fake.credit_card_security_code(card_type=brand),
            "expiration_date": fake.credit_card_expire(end=end_date),
            "balance": f"{balance_int}.{balance_cents} RON",
            "card_type": brand,
        }

    def derive_seed(self, username: str, password: str, salt: bytes) -> int:
        digest = hashlib.sha256(
            username.encode() + password.encode() + salt
        ).digest()
        return int.from_bytes(digest[:8], "big")  # 64-bit deterministic seed

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
        real_user_data = {
            "account_ID": str(uuid.uuid4()),
            "full_name": user.full_name,
            "email": user.email,
            "card_info": user.card_info
        }
        record = MinimalUserDatabaseRecord(
                username=username,
                salt=salt,
                hashed_password=self._hash_password(user.password, salt),
                real_user_data=real_user_data,
        )
        
        # Convert record to dict and handle bytes serialization
        db_serializable = record.dict()
        db_serializable['salt'] = salt.hex()  # Convert bytes to hex string
        
        # Convert CardInfo to dict if needed
        if 'card_info' in db_serializable['real_user_data']:
            card_info = db_serializable['real_user_data']['card_info']
            if hasattr(card_info, 'dict'):
                db_serializable['real_user_data']['card_info'] = {
                    'name': card_info.name,
                    'card_number': str(card_info.card_number),
                    'cvv': card_info.cvv,
                    'expiration_date': card_info.expiration_date
                }
        
        # Load existing users or create new list
        try:
            with open(DB_USER_FILE, "r") as f:
                content = f.read().strip()
                if content:
                    all_users = json.loads(content)
                else:
                    all_users = []
        except FileNotFoundError:
            all_users = []
        
        # Add new user to list
        all_users.append(db_serializable)
        
        # Save all users
        with open(DB_USER_FILE, "w") as f:
            json.dump(all_users, f, indent=2)

        return {"success": True}
                            
    async def login(self, username: str, password: str):
        record = self.find_user_in_database(username)
        if record is None:
            await sleep(0.5)  # Mitigate timing attacks ! The attacker cannot say that a lower login time makes the password the real one because if not sleep it would take less time to respond than for Generation for honey
            return False, None, {"error": "User not found"}

        salt = record.salt
        hashed_attempt = self._hash_password(password, salt)

        if hashed_attempt == record.hashed_password:
            return True, record.real_user_data, {"is_real": True}
        # Honey Encryption path
        seed = self.derive_seed(username, password, salt)

        fake_data = self.generate_fake_user_data(
            record.real_user_data,
            seed
        )

        print("login detected")

        return False, fake_data, {"is_real": False}


    def find_user_in_database(self, username: str, filename: str = DB_USER_FILE) -> Optional[MinimalUserDatabaseRecord]:
        """Find user in file - expects users stored as array"""
        try:
            with open(filename, 'r') as f:
                content = f.read().strip()
                if not content:
                    return None
                all_users = json.loads(content)
            
            # Search for matching username
            for db_serializable in all_users:
                if db_serializable['username'] == username:
                    # Convert hex back to bytes
                    user_record = MinimalUserDatabaseRecord(
                        username=db_serializable['username'],
                        salt=bytes.fromhex(db_serializable['salt']),
                        hashed_password=db_serializable['hashed_password'],
                        real_user_data=db_serializable['real_user_data'],
                    )
                    return user_record
            
            return None
        except FileNotFoundError:
            return None
        



def generate_user(honey_system: HoneyLoginSystem):
    from faker import Faker
    fake = Faker()
    # Generate a valid card number using faker
    valid_card = fake.credit_card_number(card_type='mastercard')
    demo_user=User(
        full_name="Alice Example",
        email="alice@gmail.com",
        password="SecurePass123!",
        card_info=CardInfo(
            name="Alice Example",
            card_number=valid_card,  # Luhn-valid card number
            cvv="123",
            expiration_date="09/29",
            brand=PaymentCardBrand.mastercard
        )
    )
    registration_result = honey_system.register_user(demo_user)
    print("Registration Result:", registration_result)    



async def test_login(honey_system: HoneyLoginSystem):
    print("\n" + "=" * 70)
    print("TESTING LOGIN WITH WRONG PASSWORDS")
    print("=" * 70)
    pass1 = "Wrong!"
    pass2="Wrong!"
    is_real, user_data, metadata = await honey_system.login("alice@example.com", pass1)
    print(f"\nAttempting login with password: '{pass1}'")
    if user_data:
        print(f"  Login 'successful': {metadata}")
        print(f"  Email: {user_data.get('email')}")
        print(f"  Card: {user_data.get('card_number')}")
    is_real, user_data, metadata = await honey_system.login("alice@example.com", pass2)
    print(f"\nAttempting login with password: '{pass2}'")
    if user_data:
        print(f"  Login 'successful': {metadata}")
        print(f"  Email: {user_data.get('email')}")
        print(f"  Card: {user_data.get('card_number')}")

    for i in range(5):
        wrong_pass = "WrongPass" + str(random.randint(0, 100))
        print(f"\nAttempt {i+1}: Trying password '{wrong_pass}'")
        is_real, user_data, metadata = await honey_system.login("alice@example.com", wrong_pass)
        
        if user_data:
            print(f"  Login 'successful': {metadata}")
            print(f"  Email: {user_data.get('email')}")
            print(f"  Card: {user_data.get('card_number')}")
        else:
            print(f"  Login failed: {metadata}")

if __name__ == "__main__":
    import asyncio
    
    honey_system = HoneyLoginSystem()
    
    # Generate and register user
    #generate_user(honey_system)
    
    # Test login with asyncio.run()
    asyncio.run(test_login(honey_system=honey_system))