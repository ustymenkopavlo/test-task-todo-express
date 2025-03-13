import { ProjectModel } from '../models/projectModel.js';
import { TodoModel, todoStatusEnum } from '../models/todoModel.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { HttpError } from '../utils/HttpError.js';
import { notifyProjectMembers } from '../utils/socketUtils.js';

export const createTodo = controllerWrapper(async (req, res) => {
  const {
    userId,
    params: { projectId },
  } = req;

  const project = await ProjectModel.findOne({ _id: projectId, users: userId });
  if (!project) throw HttpError(404, 'Project not found.');

  const todo = await TodoModel.create({
    ...req.body,
    projectId,
    userId,
    history: [{ status: todoStatusEnum.TODO, timestamp: new Date() }],
  });

  project.tasks.push(todo._id);
  project.save();

  notifyProjectMembers(req, project, 'todoCreated', todo);

  res.status(201).json(todo);
});

export const updateTodo = controllerWrapper(async (req, res) => {
  const {
    params: { projectId, taskId },
    body: { status, description, name },
    userId,
  } = req;

  const project = await ProjectModel.findOne({ _id: projectId, users: userId });
  if (!project) throw HttpError(404, 'Project not found');

  const todo = await TodoModel.findOne({ _id: taskId, projectId });
  if (!todo) throw HttpError(404, 'Todo not found');

  if (name) todo.name = name;

  //typeof description === 'string' in case if user wants description to be empty just pass ''
  if (description || typeof description === 'string') {
    todo.description = description;
  }

  const isStatusChanged = status && todo.status !== status;
  if (isStatusChanged) {
    todo.history.push({ status, timestamp: new Date() });
    todo.status = status;
  }

  await todo.save();

  notifyProjectMembers(
    req,
    project,
    isStatusChanged ? 'taskMoved' : 'todoUpdated',
    todo
  );

  res.json(todo);
});

export const deleteTodo = controllerWrapper(async (req, res) => {
  const {
    userId,
    params: { projectId, taskId },
  } = req;

  const todo = await TodoModel.deleteOne({ _id: taskId, userId, projectId });
  if (!todo) throw HttpError(404, 'Todo not found');

  res.sendStatus(200);
});
