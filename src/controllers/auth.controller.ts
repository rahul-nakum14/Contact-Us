import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

export class AuthController {
  static async googleLogin(req: Request, res: Response) {
    try {
      const user = await AuthService.googleAuth(req.body.token);
      res.json(successResponse('Google authentication successful', user));
    } catch (error) {
      res.status(400).json(errorResponse('Google authentication failed', error));
    }
  }

  static async facebookLogin(req: Request, res: Response) {
    try {
      const user = await AuthService.facebookAuth(req.body.token);
      res.json(successResponse('Facebook authentication successful', user));
    } catch (error) {
      res.status(400).json(errorResponse('Facebook authentication failed', error));
    }
  }
}