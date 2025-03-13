import express from 'express';

import userRouter from './usersRouter.js';
import projectRouter from './projectRouter.js';

import { auth } from '../middlewares/authMiddleware.js';

const globalRouter = express.Router();

globalRouter.use('/users', userRouter);
globalRouter.use('/projects', auth, projectRouter);

export default globalRouter;
