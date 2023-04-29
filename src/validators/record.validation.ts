// src/validation/recordValidation.ts
import Joi from "joi";

export const recordValidationSchema = Joi.object({
  operation_id: Joi.string().required(),
  input1: Joi.number().required(),
  input2: Joi.number().required(),
  user: Joi.object().required(),
});
