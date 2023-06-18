import bcrypt from "bcryptjs";
import {User} from "../../../../models/User";
import {randomUUID} from "crypto";
import {createUser} from "../../../../db/userQueries";

export const create = async (req, res) => {
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
}