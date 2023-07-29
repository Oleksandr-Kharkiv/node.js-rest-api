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

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"})

    res.json({token, user:{
      email,
      // subscription,   /* додай це поле в res */
    }});
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
};