import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();

router.post('/', FormController.createForm);

export default router;