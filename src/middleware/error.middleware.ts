// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json(errorResponse('Internal Server Error', err.message));
};
