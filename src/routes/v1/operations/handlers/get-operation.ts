import {getOperationById} from "../../../../db/operationsQueries";

export const getOperation = async (_req, res) => {
    try {
        const id = _req.params.id;
        const operation = await getOperationById(id);
        if (!operation) {
            return res.status(404).json({error: "Operation not found"});
        }
        res.status(200).json(operation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}