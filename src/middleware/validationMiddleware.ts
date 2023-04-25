import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

export const validate = (schema: Schema) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else {
    next();
  }
};
