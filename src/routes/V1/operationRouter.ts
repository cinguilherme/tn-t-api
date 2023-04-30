import { Router } from "express";
import {
  createOperation,
  deleteOperationById,
  getAllOperations,
} from "../../db/operationsQueries";
import { authenticateJWT } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { newOperationSchema } from "../../validators/operationValidatior";

const removeUser = (body: any) => {
  const { user, ...rest } = body;
  return rest;
};

export const router = Router();
router.post(
  "/",
  authenticateJWT,
  validate(newOperationSchema),
  async (req, res) => {
    try {
      const operation = removeUser(req.body);
      const createdOperation = await createOperation(operation);
      res.status(201).json(createdOperation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all operations
router.get("/", authenticateJWT, async (_req, res) => {
  try {
    const operations = await getAllOperations();
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete operation by id
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);
    const deletedOperation = await deleteOperationById(id);
    if (deletedOperation) {
      res.status(200).send(deletedOperation);
    } else {
      res.status(404).send({ error: "Operation not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error deleting operation" });
  }
});
