import Joi from "joi";

const newUserSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const userUpdateSchema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().email(),
  password: Joi.string().min(8),
  status: Joi.string().valid("active", "inactive", "deleted"),
}).min(2); // At least one field other than the ID should be present

const loginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
});

export { newUserSchema, userUpdateSchema, loginSchema };
