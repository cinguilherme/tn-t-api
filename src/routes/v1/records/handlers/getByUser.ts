import {Request, Response} from "express";
import {getRecordsByUser} from "../../../../db/recordsQueries";

export const getByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const {limit, lastKey} = req.query;

        if (!userId) {
            return res.status(400).json({error: "User ID is required"});
        }

        const records = await getRecordsByUser(userId, +limit, lastKey as string);
        res.json(records);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}