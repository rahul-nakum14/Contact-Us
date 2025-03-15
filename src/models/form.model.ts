import { Schema, model, Document } from "mongoose";

export interface IForm extends Document {
  title: string;
  userId: string;
  fields: Array<{ name: string; type: string; required: boolean }>;
  theme: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = new Schema<IForm>(
  {
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fields: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        required: { type: Boolean, required: true },
      },
    ],
    theme: { type: String, default: "default" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Form = model<IForm>("Form", formSchema);
