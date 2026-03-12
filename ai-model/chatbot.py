import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Google Gemini API (Placeholder for AI response)
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# model = genai.GenerativeModel('gemini-pro')

def get_response(message, language="en", disease_info=None):
    # System prompt based on language
    system_prompt = "You are TomatoDoc AI, an expert agricultural assistant specializing in tomato diseases in Rwanda."
    if language == "rw":
        system_prompt = "Uri TomatoDoc AI, umuhanga mu buhinzi n'indwara z'inyanya mu Rwanda."
    
    context = ""
    if disease_info:
        context = f"\nThe user's plant was diagnosed with {disease_info.get('disease')}. Severity is {disease_info.get('severity')}."
    
    # Mocking AI response for now. In reality, we'd call Gemini or Claude.
    if language == "rw":
        if "muraho" in message.lower():
            return "Muraho! Njyewe ndi TomatoDoc AI. Nabafasha nte uyu munsi?"
        if disease_info:
            return f"Nashatse amakuru ku ndwara ya {disease_info.get('disease')}. Iyi ndwara ifatira ku mababi n'imbuto. Inama: Gura imiti yica ubugome, kuraho amababi yafashwe."
        return "Nshobora kugufasha ku bijyanye n'ubuhinzi bw'inyanya. Mbaza ikibazo cyose."
    else:
        if "hello" in message.lower():
            return "Hello! I am TomatoDoc AI. How can I help you today?"
        if disease_info:
            return f"I see your plant has {disease_info.get('disease')}. This is a {disease_info.get('severity')} condition. You should apply copper-based fungicides and remove infected debris."
        return "I can help you with tomato farming questions. Feel free to ask anything."

    # Real implementation would be:
    # prompt = f"{system_prompt}\nContext: {context}\nUser: {message}"
    # response = model.generate_content(prompt)
    # return response.text
