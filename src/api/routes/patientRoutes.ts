import { Router } from 'express';
import { parseMessageController } from '../controllers/patientController';

// Create a new router instance
const router = Router();

// Define the route for parsing messages
router.post('/parse-message', parseMessageController);

export default router;
