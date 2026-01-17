from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pydantic_extra_types.payment import PaymentCardNumber
from typing import List, Optional, Dict
import uvicorn
from backend.register_he import HoneyLoginSystem, User, CardInfo

app = FastAPI(title="Honey Encryption API", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize honey login system
honey_system = HoneyLoginSystem(num_honeywords=4)  # 5 total passwords (1 real + 4 fake)

# Response models
class RegistrationResponse(BaseModel):
    success: bool
    message: str
    username: str
    total_passwords: int
    warning: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    success: bool
    is_real_password: bool
    user_data: Optional[Dict] = None
    message: str

class RegistryResponse(BaseModel):
    total_users: int
    users: List[Dict]

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Honey Encryption & Honeywords API",
        "endpoints": {
            "POST /register": "Register a new user with honeywords",
            "POST /login": "Login (always succeeds, returns real or fake data)",
            "GET /registry": "View registry (all users and their data)",
            "GET /health": "Health check"
        }
    }

# Health check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "total_users": len(honey_system.users_db)
    }

# Register endpoint
@app.post("/register", response_model=RegistrationResponse)
async def register(user: User):
    try:
        result = honey_system.register_user(user)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return RegistrationResponse(
            success=True,
            message=result["message"],
            username=user.email,
            total_passwords=honey_system.num_honeywords + 1,
            warning=result.get("warning")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login endpoint
@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    try:
        is_real, user_data, metadata = honey_system.login(request.email, request.password)
        
        if user_data is None:
            raise HTTPException(status_code=401, detail=metadata.get("error", "Login failed"))
        
        # Always return success, but indicate if it's real or fake
        return LoginResponse(
            success=True,
            is_real_password=is_real,
            user_data=user_data,
            message="Login successful!" if is_real else "Login successful (HONEYWORD DETECTED - ALERT SENT)"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Registry endpoint - view all registered users
@app.get("/registry", response_model=RegistryResponse)
async def get_registry():
    """
    View the registry of all registered users
    Shows the structure of honeywords and fake data
    """
    try:
        users_list = []
        
        for username, record in honey_system.users_db.items():
            user_info = {
                "username": username,
                "total_passwords": len(record['hashed_sweetwords']),
                "real_password_index": record['real_index'],
                "failed_attempts": len(record['failed_attempts']),
                "data_variants": []
            }
            
            # Show all data variants (real and fake)
            for idx, data in enumerate(record['user_data_list']):
                is_real = (idx == record['real_index'])
                user_info["data_variants"].append({
                    "index": idx,
                    "is_real": is_real,
                    "data": data
                })
            
            users_list.append(user_info)
        
        return RegistryResponse(
            total_users=len(users_list),
            users=users_list
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
