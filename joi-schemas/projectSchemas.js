import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  users: Joi.array().items(Joi.string()),
});

export const inviteUserToProjectSchema = Joi.object({
  id: Joi.string().required(),
});
