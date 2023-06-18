import {getAllRecords} from "../../../../db/recordsQueries";

export const getAll = async (req, res) => {
    try {
        const records = await getAllRecords();
        res.json(records);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}