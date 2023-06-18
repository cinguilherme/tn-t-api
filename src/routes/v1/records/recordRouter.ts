import {Router} from "express";
import {authenticateJWT} from "../../../middleware/authMiddleware";
import {recordValidationSchema} from "../../../validators/record.validation";
import {validate} from "../../../middleware/validationMiddleware";
import {createRecord, deleteRecord, getAll, getByUser} from "./handlers";

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
    createRecord);

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
router.get("/", authenticateJWT, getAll);

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
router.get("/user/:id", getByUser);

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
router.delete("/:id", deleteRecord);
