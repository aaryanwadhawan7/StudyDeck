import mongoose, { Document, Schema } from "mongoose";

export interface IFolder extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  parentFolder?: mongoose.Types.ObjectId;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: [100, "Folder name cannot exceed 100 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      // Can have nested folders!
      default: null,
    },
    color: {
      type: String,
      default: "#3B82F6",
      // Default blue color
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ userId: 1, parentFolder: 1 });

export const Folder = mongoose.model<IFolder>("Folder", folderSchema);
