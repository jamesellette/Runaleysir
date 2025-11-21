# backend/api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import os

app = FastAPI(title="Runaleysir Backend")

# Allow Electron frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "file://", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CipherRequest(BaseModel):
    cipher_text: str
    cipher_type: str = "unknown"
    historical_context: str = ""
    api_key: str

@app.post("/analyze/cipher")
async def analyze_cipher(request: CipherRequest):
    try:
        # Import the analysis engine from Electron
        # In production, this would be handled by the Electron process
        # For now, return a simple response structure
        
        if not request.api_key:
            raise HTTPException(400, "API key is required")
        
        # Basic validation
        if not request.cipher_text or len(request.cipher_text.strip()) == 0:
            raise HTTPException(400, "Cipher text cannot be empty")
        
        return {
            "success": True,
            "message": "Analysis request received. The Electron process will handle the AI model calls.",
            "cipher_text": request.cipher_text,
            "cipher_type": request.cipher_type,
            "context": request.historical_context
        }
        
    except HTTPException:
        raise
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "runaleysir-backend"}

@app.get("/")
async def root():
    return {
        "name": "Runaleysir Backend API",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    # Run on port 8001 to avoid conflicts
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
