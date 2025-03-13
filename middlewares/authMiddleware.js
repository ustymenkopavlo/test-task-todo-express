import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/HttpError.js';

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw HttpError(401, 'Unauthorized');

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
    if (err) throw HttpError(403, 'Invalid token');

    req.userId = payload.userId;
    next();
  });
};
