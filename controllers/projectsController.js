import { ProjectModel } from '../models/projectModel.js';
import { UserModel } from '../models/userModel.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { HttpError } from '../utils/HttpError.js';

export const createProject = controllerWrapper(async (req, res) => {
  const { name, users = [] } = req.body;

  if (!users.includes(req.userId)) users.push(req.userId);

  const project = await ProjectModel.create({ name, users, tasks: [] });

  res.status(201).json(project);
});

export const getUsersProjects = controllerWrapper(async (req, res) => {
  const { userId } = req;
  const projects = await ProjectModel.find({ users: userId }).select(
    '-tasks -users'
  );
  res.json(projects);
});

export const inviteUserToProject = controllerWrapper(async (req, res) => {
  const {
    userId,
    params: { projectId },
    body: { id },
  } = req;

  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, 'User not found.');

  const project = await ProjectModel.findOne({ _id: projectId, users: userId });
  if (!project) throw HttpError(404, 'Project not found.');

  if (project.users.includes(id))
    throw HttpError(400, 'User is already in project.');

  project.users.push(id);
  await project.save();

  res.sendStatus(200);
});

export const getProjectById = controllerWrapper(async (req, res) => {
  const {
    userId,
    params: { projectId },
  } = req;

  const project = await ProjectModel.findOne({
    _id: projectId,
    users: userId,
  }).populate('tasks');

  if (!project) throw HttpError(404, 'Project not found');

  res.json(project);
});
