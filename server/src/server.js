import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/dbConfig.js";

import authRoutes from './routers/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
connectDB();

app.use('/api/auth', authRoutes);


app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));