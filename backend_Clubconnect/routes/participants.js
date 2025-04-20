import express from 'express';
import { registerStudent, getRegistrationsByEvent } from '../controllers/participantsControllers.js';

const router = express.Router();

router.post('/studentregister', registerStudent);
router.get('/participantsStud', getRegistrationsByEvent);

export default router;
