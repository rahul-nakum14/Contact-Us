import mongoose, { model, Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  formId: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    data: { type: Object, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Submission = model<ISubmission>("Submission", submissionSchema);
