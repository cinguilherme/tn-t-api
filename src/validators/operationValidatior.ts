import Joi from "joi";

const newOperationSchema = Joi.object({
  type: Joi.string()
    .min(3)
    .valid(
      "addition",
      "subtraction",
      "multiplication",
      "division",
      "square_root",
      "random_string"
    )
    .required(),
  cost: Joi.number().min(0),
  user: Joi.object().required(),
});

export { newOperationSchema };
