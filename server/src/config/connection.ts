import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });


const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost/googlebooks';

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    return mongoose.connection;
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

export default db;