import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  color?: string;
  createdAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    color: {
      type: String,
      default: "#10B981",
      // Default green color
    },
  },
  {
    timestamps: true,
  }
);

// This will assign unique tag name
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Tag = mongoose.model<ITag>("Tag", tagSchema);
