import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  isDeleted: boolean;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["ACTIVE", "ARCHIVED", "DELETED"],
    default: "ACTIVE",
  },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<IProject>("Project", projectSchema);