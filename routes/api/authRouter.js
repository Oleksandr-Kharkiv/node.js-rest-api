import express from "express";
import authController from "../../controllers/authController.js";
import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/usersSchemas.js";
import authenticate from "../../middlewars/authenticate.js";
import upload from "../../middlewars/upload.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatarURL"), validateBody(usersSchemas.userSchema), authController.signup);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail);

authRouter.post("/login", validateBody(usersSchemas.userSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout)

authRouter.patch("/", authenticate, 
validateBody(usersSchemas.userSubscriptionSchema), 
authController.updateSubscriptionUser);

authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), authController.updateAvatarUser);

export default authRouter;