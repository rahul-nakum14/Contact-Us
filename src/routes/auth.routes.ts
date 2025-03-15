// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/google', AuthController.googleLogin);
router.post('/facebook', AuthController.facebookLogin);

export default router;