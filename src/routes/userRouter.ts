import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import express from "express";
import {
  BuildUserQueryParams,
  createUser,
  deleteUserById,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
} from "../db/userQueries";
import { validate } from "../middleware/validationMiddleware";
import { User } from "../models/User";
import {
  loginSchema,
  newUserSchema,
  userUpdateSchema,
} from "../validators/userValidator";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Use an environment variable or a strong secret key
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "1h",
      }); // Set an appropriate expiration time for the token

      res.status(200).json({ message: "Login successful", token: token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", validate(newUserSchema), async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user: User = {
      id: randomUUID(),
      username: req.body.username,
      password: hashedPassword,
      status: req.body.status,
      credit: 100, //default value
    };

    const { id, username } = await createUser(user);
    res.status(201).json({ id, username });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, id } = await getUserById(userId);
    if (id) {
      res.status(200).send({ username, id });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error getting user" });
  }
});

router.put("/:id", validate(userUpdateSchema), async (req, res) => {
  try {
    const updatedUser = await updateUser(req.body);
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error updating user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUserById(userId);
    if (deletedUser) {
      res.status(200).send(deletedUser);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error deleting user" });
  }
});

export default router;
