import { Schema, model } from 'mongoose';

export const todoStatusEnum = {
  TODO: 'TODO',
  INPROGRESS: 'In Progress',
  DONE: 'DONE',
};

export const todoStatusArray = ['TODO', 'In Progress', 'Done'];

const todoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: todoStatusArray,
      default: todoStatusEnum.TODO,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    history: [
      {
        status: {
          type: String,
          enum: todoStatusArray,
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const TodoModel = model('Todo', todoSchema);
