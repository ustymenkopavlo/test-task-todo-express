import Joi from 'joi';

export const registerUserSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required().min(8),
  name: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});
