import app from './api';
import logger from './utils/logger';

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
