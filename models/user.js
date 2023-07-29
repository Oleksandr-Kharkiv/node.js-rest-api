import { Schema, model } from "mongoose";

import { handleSaveError, validateAtUpdate } from "./hooks.js";

import { emailRegexp } from "../constants/userConstants.js";

const userSchema = new Schema({
    password: {
      type: String,
      minLenth: 6,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegexp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String
  }, {versionKey: false, timestamps: true});

  userSchema.pre("findOneAndUpdate", validateAtUpdate);
  userSchema.post("save", handleSaveError);
  userSchema.post("findOneAndUpdate", handleSaveError);

  const User = model("user", userSchema)

  export default User;