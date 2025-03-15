import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { errorResponse } from '../utils/response';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json(errorResponse('Access denied, no token provided'));
  }
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid token'));
  }
};
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { ENV } from "../config/env";
// import { errorResponse } from "../utils/response";
// import { User } from "../models/user.model";

// export interface AuthRequest extends Request {
//   user?: any;
// }

// export const authenticateUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json(errorResponse("Access denied. No token provided."));
//     }

//     const decoded: any = jwt.verify(token, ENV.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json(errorResponse("Invalid token."));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json(errorResponse("Authentication failed", error));
//   }
// };
