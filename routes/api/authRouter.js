import express from "express";
import authController from "../../controllers/authController.js";
import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/usersSchemas.js";
import authenticate from "../../middlewars/authenticate.js";


const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authController.signup)

authRouter.post("/login", validateBody(usersSchemas.userSignupSchema), authController.signin)

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post("/logout", authenticate, authController.signout)

export default authRouter;