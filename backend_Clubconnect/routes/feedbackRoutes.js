// routes/feedback.routes.js
import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/Getfeedback', submitFeedback);
router.get('/feedback', getAllFeedback);

export default router;
