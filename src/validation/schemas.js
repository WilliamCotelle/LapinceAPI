import Joi from "joi";
import { errorMessages } from "../errors/errorMessages.js";
import { HTTPError } from "../errors/httpError.js";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": errorMessages.email.invalid,
    "any.required": errorMessages.email.required,
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": errorMessages.firstName.min,
    "string.max": errorMessages.firstName.max,
    "any.required": errorMessages.firstName.required,
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": errorMessages.lastName.min,
    "string.max": errorMessages.lastName.max,
    "any.required": errorMessages.lastName.required,
  }),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[\W_]/)
    .required()
    .messages({
      "string.min": errorMessages.password.min,
      "string.max": errorMessages.password.max,
      "string.pattern.base": errorMessages.password.pattern,
      "any.required": errorMessages.password.required,
    }),
  confirmation: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": errorMessages.confirmation.match,
    "any.required": errorMessages.confirmation.required,
  }),
  consent: Joi.boolean().valid(true).required().messages({
    "any.required": errorMessages.consent.required,
    "boolean.base": errorMessages.consent.boolean,
    "any.only": errorMessages.consent.only,
  }),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": errorMessages.email.invalid,
    "any.required": errorMessages.email.required,
  }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.min": errorMessages.password.min,
    "string.max": errorMessages.password.max,
    "any.required": errorMessages.password.required,
  }),
});

export const createValidationMiddleware = (schema, requestProperty) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[requestProperty]);

    if (error) {
      const errorMessage = error.details[0].message;
      return next(new HTTPError(400, errorMessage));
    }

    next();
  };
};
