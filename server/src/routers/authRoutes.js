import express from 'express';

import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);


// router
//   .route("/")
//   .get(fetchProducts)
//   .post(authenticate, authorizeAdmin, formidable(), addProduct);

export default router;