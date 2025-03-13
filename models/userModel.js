import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

export const UserModel = model('User', userSchema);
