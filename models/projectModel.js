import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
});

export const ProjectModel = model('Project', projectSchema);
