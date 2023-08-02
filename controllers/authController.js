import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

dotenv.config()
const {JWT_SECRET} = process.env;

const signup = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
      throw HttpError(409, "Email in use")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({user:{
      email: newUser.email,
      subscription: newUser.subscription,
    }
    }
    );
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      throw HttpError(401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
      throw HttpError(401, "Email or password is wrong")
    }
    
    const payload = { 
      id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({token, user:{
      email,
      subscription: user.subscription,
    }});
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res) => {
  const {email, subscription} = req.user;
  res.json({
    email,
    subscription
  });
}

const signout = async (req, res, next) => {
try {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});
  res.status(204).json();
} catch (error) {
  next(error);
}
}

const updateSubscriptionUser = async(req, res, next) =>{
  try {
    console.log(req.user);
    const { id, email } = req.user;
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
   const newSubscription = req.body.subscription;
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({email, subscription: newSubscription});
  } catch (error) {
    next(error);
  }
}

export default {
  signup,
  signin,
  getCurrent,
  signout,
  updateSubscriptionUser
};
