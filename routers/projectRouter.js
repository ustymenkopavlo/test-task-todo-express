import express from 'express';
import {
  createProject,
  getProjectById,
  getUsersProjects,
  inviteUserToProject,
} from '../controllers/projectsController.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createProjectSchema,
  inviteUserToProjectSchema,
} from '../joi-schemas/projectSchemas.js';
import {
  createTodo,
  deleteTodo,
  updateTodo,
} from '../controllers/tasksController.js';
import {
  createTodoSchema,
  updateTodoSchema,
} from '../joi-schemas/todoSchemas.js';
import { validateObjectIds } from '../middlewares/validateObjectIds.js';

const router = express.Router();

// Projects
router.post('/', validateBody(createProjectSchema), createProject);
router.get('/', getUsersProjects);
router.post(
  '/:projectId/invite',
  validateBody(inviteUserToProjectSchema),
  inviteUserToProject
);
router.get('/:projectId', validateObjectIds('projectId'), getProjectById);

//Todo`s
router.post(
  '/:projectId/tasks',
  validateObjectIds('projectId'),
  validateBody(createTodoSchema),
  createTodo
);
router.put(
  '/:projectId/tasks/:taskId',
  validateObjectIds('projectId', 'taskId'),
  validateBody(updateTodoSchema),
  updateTodo
);
router.delete(
  '/:projectId/tasks/:taskId',
  validateObjectIds('projectId', 'taskId'),
  deleteTodo
);

export default router;
