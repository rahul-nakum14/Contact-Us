import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';

const router = Router();

router.post('/', SubmissionController.submitForm);

export default router;
