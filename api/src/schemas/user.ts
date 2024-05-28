import { Schema, SchemaTypes, model } from "mongoose";

interface User {
  username: string;
  password: string;
}

const UserSchema = new Schema<User>(
  {
    username: {
      type: SchemaTypes.String,
      required: true,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
