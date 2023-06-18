import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {randomUUID} from "crypto";
import express from "express";
import {
    BuildUserQueryParams,
    createUser,
    deleteUserById,
    getUserById,
    getUserByUsername,
    getUsers,
    updateUser,
} from "../../db/userQueries";
import {validate} from "../../middleware/validationMiddleware";
import {User} from "../../models/User";
import {
    loginSchema,
    newUserSchema,
    userUpdateSchema,
} from "../../validators/userValidator";
import {authenticateJWT} from "../../middleware/authMiddleware";

export const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
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
router.post("/login", validate(loginSchema), async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({error: "Invalid username or password"});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Use an environment variable or a strong secret key
            const token = jwt.sign({userId: user.id}, secretKey, {
                expiresIn: "1h",
            }); // Set an appropriate expiration time for the token

            res
                .status(200)
                .json({message: "Login successful", token: token, userId: user.id});
        } else {
            res.status(401).json({error: "Invalid username or password"});
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
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
router.post("/", validate(newUserSchema), async (req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user: User = {
            id: randomUUID(),
            username: req.body.username,
            password: hashedPassword,
            status: req.body.status,
            credit: req.body.credit,
        };

        const {id, username, status, credit} = await createUser(user);
        res.status(201).json({id, username, status, credit});
    } catch (error) {
        console.log("Error creating user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

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
router.get("/", authenticateJWT, async (req, res) => {
    try {
        const queryParams: BuildUserQueryParams = {
            status: 'active',
        };
        const users = await getUsers(queryParams);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({error: "Error getting users"});
    }
});

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
router.get("/:id", authenticateJWT, async (req, res) => {
    try {
        const userId = req.params.id;
        const {username, id, status, credit} = await getUserById(userId);
        if (id) {
            res.status(200).send({username, id, status, credit});
        } else {
            res.status(404).send({error: "User not found"});
        }
    } catch (error) {
        res.status(500).send({error: "Error getting user"});
    }
});

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
router.put("/:id", validate(userUpdateSchema), async (req, res) => {
    try {
        const {id, username, status, credit} = await updateUser(req.body);
        if (id) {
            res.status(200).send({id, username, status, credit});
        } else {
            res.status(404).send({error: "User not found"});
        }
    } catch (error) {
        res.status(500).send({error: "Error updating user"});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await deleteUserById(userId);
        if (deletedUser) {
            res.status(200).send(deletedUser);
        } else {
            res.status(404).send({error: "User not found"});
        }
    } catch (error) {
        res.status(500).send({error: "Error deleting user"});
    }
});
