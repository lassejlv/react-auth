import { Schema, model } from "mongoose";

interface User {
  username: string;
  email?: string;
  email_verified: boolean;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
