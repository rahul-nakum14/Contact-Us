import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { SubmissionService } from '../services/submission.service';

export class SubmissionController {
  static async submitForm(req: Request, res: Response) {
    try {
      const submission = await SubmissionService.submit(req.body);
      res.json(successResponse('Form submitted successfully', submission));
    } catch (error) {
      res.status(400).json(errorResponse('Submission failed', error));
    }
  }
}