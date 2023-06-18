import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {getUserByUsername} from "../../../../db/userQueries";

export const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({error: "Invalid username or password"});
        }

        const isPasswordMatch = bcrypt.compare(password, user.password);

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
}