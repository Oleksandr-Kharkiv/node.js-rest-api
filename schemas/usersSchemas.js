import Joi from "joi";
import {validSubscriptionList} from "../constants/userConstants.js"
import { emailRegexp } from "../constants/userConstants.js";

const userSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...validSubscriptionList).required(),
});

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export default { 
    userSchema, 
    userSubscriptionSchema,
    userEmailSchema, 
};
