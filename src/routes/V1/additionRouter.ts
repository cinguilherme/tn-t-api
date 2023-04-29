// src/routes/additionRouter.ts
import express from "express";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { getUserById, updateUser } from "../../db/userQueries";
import { getOperationCost } from "../../models/Operation";

export const router = express.Router();

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const operationType = "addition";
    const cost = getOperationCost(operationType);

    if (user.credit < cost) {
      return res.status(403).json({ error: "Insufficient credits" });
    }

    const { a, b } = req.body;
    const result = a + b;

    // Update the user's credits and save it to the database.
    user.credit -= cost;
    await updateUser(user);

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
