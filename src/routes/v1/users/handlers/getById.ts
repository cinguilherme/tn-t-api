import {getUserById} from "../../../../db/userQueries";

export const getById = async (req, res) => {
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
}