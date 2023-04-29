// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer {token}" format

    const secretKey = process.env.JWT_SECRET || "your-secret-key";

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Attach the user information to the request object
      req.body.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
