import {deleteUserById} from "../../../../db/userQueries";

export const deleteUser = async (req, res) => {
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
}