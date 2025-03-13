import { HttpError } from '../utils/HttpError.js';

export const validateBody = (schema) => {
  return async (req, _, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      next(HttpError(400, error.message));
    }
  };
};
