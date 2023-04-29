import bcrypt from "bcrypt";
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
      res.status(200).json({ message: "Login successful", user: user });
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
    };

    await createUser(user);
    res.status(201).json(user);
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const queryParams: BuildUserQueryParams = {
      status: req.query.status as string,
      username: req.query.username as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      exclusiveStartKey: req.query.exclusiveStartKey as string,
    };
    const { users, lastEvaluatedKey } = await getUsers(queryParams);
    res.status(200).send({ users, lastEvaluatedKey });
  } catch (error) {
    res.status(500).send({ error: "Error getting users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (user) {
      res.status(200).send(user);
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
