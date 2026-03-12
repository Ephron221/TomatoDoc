from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import predictor
import chatbot
import os

app = FastAPI(title="TomatoDoc AI API")

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    diseaseInfo: Optional[dict] = None

@app.get("/")
async def root():
    return {"message": "TomatoDoc AI Service is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    # Save temp file for predictor
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as f:
        f.write(contents)
    
    try:
        result = predictor.predict(temp_filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = chatbot.get_response(request.message, request.language, request.diseaseInfo)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
