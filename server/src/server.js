import express from "express";
import authRoutes from "../routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;


const app = express();
app.use(express.json());

app.use("/", authRoutes);

app.listen(3000, () => console.log(`Server running on ${PORT}`));