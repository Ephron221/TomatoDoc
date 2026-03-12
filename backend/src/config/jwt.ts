import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_123';
export const JWT_EXPIRES_IN = '1d';
