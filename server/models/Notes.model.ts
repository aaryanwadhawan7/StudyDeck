import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface INotes extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  folderId: mongoose.Types.ObjectId;
  lastReviewed?: Date;
  nextReviewed?: Date;
  reviewCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notesSchema = new Schema<INotes>(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
      maxLength: [200, "Title length should be less than 200 words!"],
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReviewed: {
      type: Date,
      default: null,
    },
    nextReviewed: {
      type: Date,
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
      // Initially, Notes is not pinned by user
    },
  },
  {
    timestamps: true,
  }
);

export const Notes = mongoose.model<INotes>("Notes", notesSchema);
