from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, EmailStr, field_validator
from pydantic_extra_types.payment import PaymentCardNumber
from typing import List, Optional, Dict
import uvicorn
import json
from login_he import HoneyLoginSystem, User

app = FastAPI(title="Honey Encryption API", version="1.0.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_messages = []
    for error in errors:
        field = " -> ".join(str(x) for x in error["loc"])
        message = error["msg"]
        error_messages.append(f"{field}: {message}")
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation failed",
            "details": error_messages
        },
    )

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize honey login system
honey_system = HoneyLoginSystem()

# Response models
class RegistrationResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    error: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator('email', mode='before')
    @classmethod
    def email_not_empty(cls, v):
        if v is None or (isinstance(v, str) and v.strip() == ''):
            raise ValueError('Email cannot be empty')
        return v

    @field_validator('password', mode='before')
    @classmethod
    def password_not_empty(cls, v):
        if v is None or (isinstance(v, str) and v.strip() == ''):
            raise ValueError('Password cannot be empty')
        return v

class LoginResponse(BaseModel):
    success: bool
    is_real_password: bool
    user_data: Optional[Dict] = None
    message: str

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Honey Encryption & Honeywords API",
        "endpoints": {
            "POST /register": "Register a new user with honeywords",
            "POST /login": "Login (always succeeds, returns real or fake data)",
            "GET /health": "Health check"
        }
    }

@app.get("/docs")
async def get_docs():
    return app.openapi()
# Health check
@app.get("/health")
async def health():
    # Count users from file
    try:
        with open("minimal_honey_users.json", "r") as f:
            data = json.load(f)
            user_count = 1 if data else 0
    except:
        user_count = 0
    
    return {
        "status": "healthy",
        "total_users": user_count
    }

# Register endpoint
@app.post("/register", response_model=RegistrationResponse)
async def register(user: User):
    try:
        result = honey_system.register_user(user)
        
        if not result["success"]:
            return RegistrationResponse(
                success=False,
                error=result.get("error", "Registration failed")
            )
        
        return RegistrationResponse(
            success=True,
            message=f"User {user.email} registered successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login endpoint
@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    try:
        is_real, user_data, metadata = await honey_system.login(request.email, request.password)
        
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
