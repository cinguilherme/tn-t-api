import {updateUser} from "../../../../db/userQueries";

export const update = async (req, res) => {
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
}