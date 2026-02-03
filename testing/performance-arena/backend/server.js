const app = require('./app');
require('dotenv').config();
const dataService = require('./services/dataService');
const guidesService = require('./services/guidesService');

const PORT = process.env.PORT || 3000;

async function initializeData() {
  try {
    await dataService.loadData();
    guidesService.loadFromCSV();
    guidesService.recalculateAll();
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize data:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  await initializeData();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => console.log('Process terminated'));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => console.log('Process terminated'));
  });
}

startServer().catch(console.error);
