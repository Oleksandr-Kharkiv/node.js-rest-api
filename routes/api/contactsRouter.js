import express from "express";

import contactsController from "../../controllers/contactsController.js";

import contactsSchemas from "../../schemas/contactsSchemas.js";

import validateBody from "../../decorators/validateBody.js";
import isEmptyBody from "../../middlewars/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", contactsController.getById);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(contactsSchemas.contactsAddSchema),
  contactsController.add
);

contactsRouter.put(
  "/:id",
  isEmptyBody,
  validateBody(contactsSchemas.contactsAddSchema),
  contactsController.updateById
);

contactsRouter.delete("/:id", contactsController.deleteByid);

export default contactsRouter;
