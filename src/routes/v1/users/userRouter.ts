import express from "express";
import {validate} from "../../../middleware/validationMiddleware";
import {loginSchema, newUserSchema, userUpdateSchema,} from "../../../validators/userValidator";
import {authenticateJWT} from "../../../middleware/authMiddleware";
import {create, getAll, getById, login} from "./handlers";
import {update} from "./handlers/update";
import {deleteUser} from "./handlers/delete";

export const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user, token valid for 1 hour
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: The user successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoggedInUser'
 */
router.post("/login", validate(loginSchema), login);

router.post("/logout", authenticateJWT, (req, res) => {

    // invalidate token
    res.status(200).json({message: "Logged out successfully"});
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: The user successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", validate(newUserSchema), create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get users
 *     tags: [Users]
 *     queryParams:
 *       status:
 *     responses:
 *       200:
 *         description: The users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/", authenticateJWT, getAll);

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: get user by id
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", authenticateJWT, getById);

/**
 * @swagger
 * /users/:id:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/:id", validate(userUpdateSchema), update);

router.delete("/:id", deleteUser);
