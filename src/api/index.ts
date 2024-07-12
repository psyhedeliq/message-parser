import express from 'express';
import patientRoutes from './routes/patientRoutes';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the patient routes for any requests to /api
app.use('/api', patientRoutes);

export default app;
