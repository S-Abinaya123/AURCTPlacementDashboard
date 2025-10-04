import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";

dotenv.config();

const PORT = process.env.PORT;


const app = express();
app.use(express.json());
connectDB();


app.listen(3000, () => console.log(`🚀 Server running on ${PORT}`));