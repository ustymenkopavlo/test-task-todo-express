import express from 'express';
import http from 'http';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import globalRouter from './routers/globalRouter.js';
import connectDB from './db/connectDB.js';
import { initSocket } from './socket/socket.js';

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(globalRouter);

const { io, connectedUsers } = initSocket(server);
app.set('io', io);
app.set('connectedUsers', connectedUsers);

app.use((error, _, res, __) => {
  console.error('Global error: ', error);
  const { message, status = 500 } = error;
  res.status(status).json(message);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
