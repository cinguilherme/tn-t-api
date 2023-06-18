import {Router} from "express";
import {authenticateJWT} from "../../../middleware/authMiddleware";
import {validate} from "../../../middleware/validationMiddleware";
import {newOperationSchema} from "../../../validators/operationValidatior";
import {deleteOperation, getOperation, getOperations, newOperation} from "./handlers";

const removeUser = (body: any) => {
    const {user, ...rest} = body;
    return rest;
};

export const router = Router();

/**
 * @swagger
 * /operations:
 *   post:
 *     summary: Create a new operation
 *     tags: [Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOperation'
 *     responses:
 *       201:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.post(
    "/",
    authenticateJWT,
    validate(newOperationSchema),
    newOperation);


/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Get all operations
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.get("/", authenticateJWT, getOperations);

/**
 * @swagger
 * /operations/:id:
 *   get:
 *     summary: Get operation by Id
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.get("/:id", authenticateJWT, getOperation);

/**
 * @swagger
 * /operations/:id:
 *   delete:
 *     summary: Delete operation by id
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: The operation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 */
router.delete("/:id", authenticateJWT, deleteOperation);
