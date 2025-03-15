// Form Controller
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { FormService } from '../services/form.service';

export class FormController {
  static async createForm(req: Request, res: Response) {
    try {
      const form = await FormService.createForm(req.body);
      res.json(successResponse('Form created successfully', form));
    } catch (error) {
      res.status(400).json(errorResponse('Failed to create form', error));
    }
  }
}