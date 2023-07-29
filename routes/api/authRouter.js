import express from "express";
import authController from "../../controllers/authController.js";
import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authController.signup)

authRouter.post("/login", validateBody(usersSchemas.userSignupSchema), authController.signin)

export default authRouter;