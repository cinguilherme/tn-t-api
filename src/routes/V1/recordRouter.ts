import { Router, Request, Response } from "express";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { getUserById, updateUser } from "../../db/userQueries";
import { getOperationById } from "../../db/operationsQueries";
import {
  getRecordsByUser,
  addRecord,
  getAllRecords,
} from "../../db/recordsQueries";
import { Record } from "../../models/Record";
import { recordValidationSchema } from "../../validators/record.validation";
import { validate } from "../../middleware/validationMiddleware";
import { randomUUID } from "crypto";

export const router = Router();

router.post(
  "/",
  authenticateJWT,
  validate(recordValidationSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = req.body.user.userId;
      const { operation_id, input1, input2 } = req.body;

      if (
        !userId ||
        !operation_id ||
        input1 === undefined ||
        input2 === undefined
      ) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const user = await getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const operation = await getOperationById(operation_id);

      // Check if the user has enough credits to perform the operation
      const userRecords = await getRecordsByUser(userId);
      const totalCosts = userRecords
        .map((re) => re.amount)
        .reduce((a, b) => a + b, 0);

      if (
        user.credit < totalCosts ||
        user.credit < totalCosts + operation.cost
      ) {
        return res.status(403).json({ error: "Insufficient credits" });
      }

      // Perform the operation, assuming it's an addition for now, this has to be dependent on the operation type
      const result = input1 + input2; // disney, fix latter

      // Create the new record
      const newRecord: Record = {
        id: randomUUID(),
        user_id: userId,
        operation_id: operation_id,
        amount: operation.cost,
        user_balance: user.credit,
        operation_response: result,
        date: new Date().toISOString(),
      };

      // Save the new record to the database
      await addRecord(newRecord);

      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const records = await getAllRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const records = await getRecordsByUser(userId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", (req: Request, res: Response) => {
  // Add record update logic here
});

router.delete("/:id", (req: Request, res: Response) => {
  // Add record deletion logic here
});
