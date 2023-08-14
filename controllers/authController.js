import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import {HttpError, sendEmail, createVerifyEmail} from "../helpers/index.js";


dotenv.config();
const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      verificationToken,
      avatarURL: gravatar.url(email, {
        protocol: "https",
        s: "250",
        r: "pg",
        d: "identicon",
      }),
    });

    const verifyEmail = createVerifyEmail({email, verificationToken});

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async(req, res) =>{
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user){
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""})
  
  res.json({
    message: "Verification successful"
  })
}

const resendVerifyEmail = async(req, res) =>{
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(404, 'Email not found')
  }
  if(user.verify){
    throw HttpError(404, 'Verification has already been passed')
  }

  const verifyEmail = createVerifyEmail({email, verificationToken: user.verificationToken});

  await sendEmail(verifyEmail);

  res.json({"message": "Verification email sent"})
}

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify){
      throw HttpError(401, "Email is not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
    // res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionUser = async (req, res, next) => {
  try {
    const { id, email } = req.user;
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    const newSubscription = req.body.subscription;
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ email, subscription: newSubscription });
  } catch (error) {
    next(error);
  }
};

const avatarPath = path.resolve("public", "avatars");

const updateAvatarUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
 
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);

    const avatar = await Jimp.read(newPath);
    avatar.resize(250, 250).write(newPath);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({avatarURL});
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  verify,
  resendVerifyEmail,
  signin,
  getCurrent,
  signout,
  updateSubscriptionUser,
  updateAvatarUser,
};
