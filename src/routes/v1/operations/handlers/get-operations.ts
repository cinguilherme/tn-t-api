import {getAllOperations} from "../../../../db/operationsQueries";

export const getOperations = async (_req, res) => {
    try {
        const operations = await getAllOperations();
        res.status(200).json(operations);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}