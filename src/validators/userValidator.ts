// src/validators/userValidator.ts
import Joi from 'joi';

const newUserSchema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const userUpdateSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().email(),
    password: Joi.string().min(8),
    status: Joi.string().valid('active', 'inactive', 'deleted'),
}).min(2); // At least one field other than the ID should be present

export { newUserSchema, userUpdateSchema };


