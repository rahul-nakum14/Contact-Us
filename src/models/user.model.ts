import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  googleId?: string;
  facebookId?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
