import User from '../models/userModels.js';
import jwt from "jsonwebtoken";

import { response } from '../utils/response.js';

export const verifyToken = async (req, res, next) => {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send(response('FAILED', 'Access denied. No token provided.', null));
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).send(response('FAILED', 'User not found.', null));
        }
        
        req.user = decoded;
        next();
    } 
    catch (err) {
        return res.status(403).send(response('FAILED', 'Invalid or expired token.', null));
    }
};