const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';

const startServer = async () => {
  await connectDB(MONGO_URI);

  http.createServer(app).listen(PORT, () => {
    console.log(`🚀 LMS server running on http://localhost:${PORT}`);
  });
};

startServer();

