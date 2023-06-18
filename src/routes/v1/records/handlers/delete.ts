import {Request, Response} from "express";
import {deleteRecordById} from "../../../../db/recordsQueries";

export const deleteRecord = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        console.log("id", id);

        if (!id) {
            return res.status(400).json({error: "Record ID is required"});
        }

        await deleteRecordById(id);

        res.status(204).json();

        // Delete record logic here
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}