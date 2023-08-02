import express from "express";
import contactsController from "../../controllers/contactsController.js";
import contactsSchemas from "../../schemas/contactsSchemas.js";
import validateBody from "../../decorators/validateBody.js";
import authenticate from "../../middlewars/authenticate.js";
import isEmptyBody from "../../middlewars/isEmptyBody.js";
import isValidId from "../../middlewars/isValidId.js";
import isEmptyBodyFavorite from "../../middlewars/isEmptyBodyFavorite.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post(
  "/", 
  isEmptyBody,
  validateBody(contactsSchemas.contactsAddSchema),
  contactsController.add
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactsAddSchema),
  contactsController.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBodyFavorite,
  validateBody(contactsSchemas.contactsUpdateFavoriteSchema),
  contactsController.updateStatusContact
);

contactsRouter.delete("/:id", isValidId, contactsController.deleteByid);

export default contactsRouter;
