import { Types } from 'mongoose';
import { HttpError } from '../utils/HttpError.js';

/**
 * Middleware to validate ObjectId parameters
 * @param {...string} paramNames - Names of route parameters to validate
 */

export const validateObjectIds = (...params) => {
  return (req, _, next) => {
    params.forEach((param) => {
      if (!Types.ObjectId.isValid(req.params[param]))
        throw HttpError(400, `Invalid ObjectId format for parameter: ${param}`);
    });

    next();
  };
};
