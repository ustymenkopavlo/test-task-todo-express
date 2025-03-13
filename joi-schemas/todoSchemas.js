import Joi from 'joi';

export const createTodoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

export const updateTodoSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid('TODO', 'In Progress', 'Done'),
  description: Joi.string().allow(''),
});
