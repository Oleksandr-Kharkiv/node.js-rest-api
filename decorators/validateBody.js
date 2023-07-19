import HttpError from "../helpers/HttpError.js";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error && error.details[0].type === "any.required") {
      const requiredData = error.details[0].context.label;
      next(HttpError(400, `missing required ${requiredData} field`));
    } else if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};
export default validateBody;
