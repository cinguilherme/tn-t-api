import { Router, Request, Response } from "express";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { getUserById, updateUser } from "../../db/userQueries";
import { getOperationById } from "../../db/operationsQueries";
import {
  getRecordsByUser,
  addRecord,
  getAllRecords,
  deleteRecordById,
} from "../../db/recordsQueries";
import { Record } from "../../models/Record";
import { performOperation, Operation } from "../../models/Operation";
import { recordValidationSchema } from "../../validators/record.validation";
import { validate } from "../../middleware/validationMiddleware";
import { randomUUID } from "crypto";

export const router = Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new Record
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRecord'
 *     responses:
 *       201:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 */
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
      const userRecords = await getRecordsByUser(userId, 500);
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
      const result = performOperation(operation, input1, input2);

      // Create the new record
      const newRecord: Record = {
        id: randomUUID(),
        user_id: userId,
        operation_id: operation_id,
        amount: operation.cost,
        user_balance: user.credit,
        operation_response: result as string,
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

/**
 * @swagger
 * /records:
 *   get:
 *     summary: get all Records
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 */
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const records = await getAllRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records/user/:id:
 *   get:
 *     summary: get user records
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 */
router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { limit, lastKey } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const records = await getRecordsByUser(userId, +limit, lastKey as string);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records:
 *   delete:
 *     summary: delete record
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("id", id);

    if (!id) {
      return res.status(400).json({ error: "Record ID is required" });
    }

    await deleteRecordById(id);

    res.status(204).json();

    // Delete record logic here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
