import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  // Add other fields as needed
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true, collection: "tbl_user" }
);

export const User = mongoose.model<IUser>("User", userSchema);
