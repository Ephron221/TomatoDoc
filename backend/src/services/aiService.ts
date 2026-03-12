import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export const predictDisease = async (imagePath: string) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));

  try {
    const response = await axios.post(`${FASTAPI_URL}/predict`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('AI Prediction Error:', error);
    throw new Error('AI service failed');
  }
};

export const getAIChatResponse = async (message: string, language: string, diseaseInfo?: any) => {
    // This would typically call Claude API or another LLM
    // For this implementation, we can call the Python chatbot service
    try {
        const response = await axios.post(`${FASTAPI_URL}/chat`, {
            message,
            language,
            diseaseInfo
        });
        return response.data.response;
    } catch (error) {
        console.error('AI Chat Error:', error);
        return "I'm sorry, I'm having trouble connecting to my brain right now.";
    }
};
