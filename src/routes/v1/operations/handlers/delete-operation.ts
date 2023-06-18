import {deleteOperationById} from "../../../../db/operationsQueries";

export const deleteOperation = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id);
        const deletedOperation = await deleteOperationById(id);
        if (deletedOperation) {
            res.status(200).send(deletedOperation);
        } else {
            res.status(404).send({error: "Operation not found"});
        }
    } catch (error) {
        res.status(500).send({error: "Error deleting operation"});
    }
}