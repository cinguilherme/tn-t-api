import Joi from "joi";

const newOperationSchema = Joi.object({
  type: Joi.string().min(3).required(),
  cost: Joi.number().min(0),
  user: Joi.object().required(),
});

export { newOperationSchema };
