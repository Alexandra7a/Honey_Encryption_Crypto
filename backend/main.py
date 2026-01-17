from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,  EmailStr
from pydantic_extra_types.payment import PaymentCardNumber
from typing import List, Optional
import base64
from he import SimpleDTE, honey_encrypt, honey_decrypt
import uvicorn

app = FastAPI(title="Honey Encryption API", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CardInfo(BaseModel):
    name: str
    card_number: PaymentCardNumber
    cvv: int
    expiration_date: str    
    
class Signup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    message: str
    card_info: CardInfo

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy"}



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
