import express from 'express';

import { loginUser, verifyTokenController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/verify-token', verifyToken, verifyTokenController);
router.post('/login', loginUser);


// router
//   .route("/")
//   .get(fetchProducts)
//   .post(authenticate, authorizeAdmin, formidable(), addProduct);

export default router;