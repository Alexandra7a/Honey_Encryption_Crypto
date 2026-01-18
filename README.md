# 🔐 Honey Encryption Banking System

A secure banking application demonstrating **Honey Encryption** and **Honeywords** techniques for enhanced security against password breaches and brute-force attacks.

## 📖 Overview

This project implements a full-stack banking application that uses advanced cryptographic techniques to protect user data even when passwords are compromised. The system generates plausible fake data (honey data) for incorrect passwords, making it extremely difficult for attackers to distinguish between real and fake credentials.

### Key Features

- **Honey Encryption**: Wrong passwords decrypt to plausible but fake user data
- **Honeywords**: Multiple fake passwords (sweetwords) alongside the real password
- **Fake Data Generation**: Realistic fake banking data using Faker library
- **Full Banking Interface**: Complete banking UI with multiple pages and features
- **Real-time Validation**: Client and server-side validation for all inputs
- **Modern Tech Stack**: FastAPI backend + Next.js frontend

## 🎯 Security Concepts

### Honey Login System
The system implements a honey login mechanism where **any password** will successfully "authenticate" a user, but wrong passwords return plausible fake data instead of real user information. This prevents attackers from knowing whether they've found the correct credentials.

**How it works:**
1. Real user data is stored with a hashed password in the database
2. When a user logs in with the **correct password**, they get their real banking data
3. When a user logs in with a **wrong password**, the system generates fake but realistic banking data
4. The fake data is deterministically generated based on the wrong password (same wrong password = same fake data)
5. Attackers cannot distinguish between real and fake sessions

## 🏗️ Architecture

```
Honey_Encryption_Crypto/
├── backend/                           # FastAPI server
│   ├── main.py                       # API endpoints (register, login, health)
│   ├── login_he.py                   # Core honey login system implementation
│   ├── requirements.txt              # Python dependencies
│   └── database/                     # User data storage
│       └── minimal_honey_users.json  # User database (JSON)
└── frontend/                          # Next.js application
    ├── app/                           # App router pages
    │   ├── login/                    # Login page
    │   ├── signup/                   # Registration page
    │   ├── bills/                    # Bills management
    │   ├── investments/              # Investment tracking
    │   ├── transactions/             # Transaction history
    │   ├── transfers/                # Money transfers
    │   └── settings/                 # User settings
    └── package.json                   # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Python** 3.8+ 
- **Node.js** 18+ and npm/yarn
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Honey_Encryption_Crypto.git
cd Honey_Encryption_Crypto
```

#### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python main.py
```

The backend server will start on `http://localhost:8000`

**Backend Endpoints:**
- `GET /` - API information
- `POST /register` - Register a new user with honeywords
- `POST /login` - Login (returns real or fake data)
- `GET /health` - Health check

#### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Run the development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

### Running the Application

1. Start the backend server (Terminal 1):
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## 💻 Usage

### Registration

1. Navigate to the signup page
2. Enter your details:
   - First Name, Middle Name (optional), Last Name
   - Email address
   - Password
   - Card Information (number, CVV, expiration date)
   - Initial balance

3. The system will:
   - Hash your password with a salt
   - Store your real user data
   - Save credentials in the database

### Login

1. Enter your email and password
2. The system will:
   - **Correct password**: Return your real banking data
   - **Incorrect password**: Return plausible fake data
   - **Always succeed**: No indication of wrong password

3. Navigate through the banking interface to view:
   - Account balance
   - Transactions
   - Bills
   - Investments
   - Transfers
   - Settings

## 🔧 Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **Faker**: Generate realistic fake data
- **Uvicorn**: ASGI server for running FastAPI
- **Hashlib**: Cryptographic hashing

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons & Lucide**: Icon libraries

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Example API Requests

**Register User:**
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "card_info": {
      "name": "John Doe",
      "card_number": "4532015112830366",
      "cvv": "123",
      "expiration_date": "12/25",
      "balance": 5000.00
    }
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

## 🔬 How the Honey Login System Works

### Core Implementation (login_he.py)

The `HoneyLoginSystem` class handles both registration and authentication:

**Registration:**
```python
def register(self, user: User) -> bool:
    # Hash the real password with salt
    salt = os.urandom(16)
    hashed_password = hashlib.sha256(salt + user.password.encode()).hexdigest()
    
    # Store user with hashed password and real data
    record = MinimalUserDatabaseRecord(
        username=user.email,
        salt=salt,
        hashed_password=hashed_password,
        real_user_data=user.dict()
    )
    # Save to database/minimal_honey_users.json
```

**Login Process:**
```python
def login(self, email: str, password: str) -> Tuple[bool, Dict]:
    # Load user from database
    user_record = self._load_user(email)
    
    # Check if password is correct
    hashed_attempt = hashlib.sha256(user_record.salt + password.encode()).hexdigest()
    
    if hashed_attempt == user_record.hashed_password:
        # Correct password → return real data
        return True, user_record.real_user_data
    else:
        # Wrong password → generate fake data
        fake_data = self.generate_fake_user_data(user_record.real_user_data, seed)
        return False, fake_data
```

**Fake Data Generation:**
```python
def generate_fake_user_data(self, real_data: Dict, seed: int) -> Dict:
    # Use Faker with deterministic seed
    fake = Faker()
    Faker.seed(seed)
    
    # Generate realistic fake banking data
    # - Maintains card brand consistency
    # - Generates plausible names, balances, dates
    # - Same seed always produces same fake data
```

## 🛡️ Security Features

1. **Password Hashing**: All passwords are hashed using SHA-256 with salt
2. **Honey Data**: Realistic fake data indistinguishable from real data using Faker library
3. **No Password Verification**: System never reveals if password is wrong - always returns data
4. **Deterministic Fakes**: Same wrong password always generates same fake data (seed-based)
5. **Brand Consistency**: Fake card data matches real card brand for realism
6. **JSON Database**: Simple file-based storage in `database/minimal_honey_users.json`

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -c "from login_he import HoneyLoginSystem; print('Honey Login System imported successfully!')"
```

### Frontend Tests

```bash
cd frontend
npm run lint
```

## 📝 Configuration

### Backend Configuration

Edit `backend/main.py` to configure:
- CORS origins (default: `http://localhost:3000`)
- API endpoints
- Database file path (default: `database/minimal_honey_users.json`)

Edit `backend/login_he.py` to configure:
- Number of fake data variations
- Faker locale and seed behavior
- User data structure

### Frontend Configuration

Edit `frontend/next.config.ts` to configure:
- API URL
- Build settings
- Environment variables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📜 License

This project is for educational purposes to demonstrate cryptographic concepts.

## 🔗 References

- [Honey Encryption Paper](https://eprint.iacr.org/2013/454.pdf) by Juels & Ristenpart
- [Honeywords](https://people.csail.mit.edu/rivest/pubs/JR13.pdf) by Juels & Rivest
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

**⚠️ Disclaimer**: This is an educational project demonstrating security concepts. Do not use in production without proper security auditing and additional security measures.
