import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { controllerWrapper } from '../utils/controllerWrapper.js';
import { UserModel } from '../models/userModel.js';
import { HttpError } from '../utils/HttpError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const register = controllerWrapper(async (req, res) => {
  const { login, password, name } = req.body;

  const isUserExist = await UserModel.findOne({ login });
  if (isUserExist) throw HttpError(409, 'User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    login,
    password: hashedPassword,
    name,
  });

  const { password: _, ...userWithoutPassword } = user.toObject();

  res.status(201).send({
    user: userWithoutPassword,
  });
});

export const login = controllerWrapper(async (req, res) => {
  const { login, password } = req.body;
  const user = await UserModel.findOne({ login });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw HttpError(404, 'Username or password is wrong!');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
  const { password: _, ...userWithoutPassword } = user.toJSON();

  res.json({ user: userWithoutPassword, accessToken });
});

export const refresh = controllerWrapper((req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw HttpError(403, 'No refresh token provided');

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) throw HttpError(403, 'Invalid refresh token');

    const newAccessToken = generateAccessToken({ _id: payload.userId });
    res.json({ accessToken: newAccessToken });
  });
});

export const getUserById = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(id).select('-password');

  if (!user) throw HttpError(404, 'User not found.');

  res.json(user);
});
