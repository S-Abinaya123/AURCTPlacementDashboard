import jwt from 'jsonwebtoken';

export const generateJwtToken = (payload, expiry) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: expiry,
    });
};