import mongoose, { Document, Schema } from "mongoose";

// Define the User interface (TypeScript type)
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  theme: "light" | "dark";
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    // Automatically adds createdAt and updatedAt
  }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", userSchema);

// Interface -> Schema (Validation and Checks) -> Model
