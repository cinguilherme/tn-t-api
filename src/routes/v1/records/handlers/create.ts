import {Request, Response} from "express";
import {getUserById} from "../../../../db/userQueries";
import {getOperationById} from "../../../../db/operationsQueries";
import {addRecord, getRecordsByUser} from "../../../../db/recordsQueries";
import {checkUserCanCreateRecord} from "../logic";
import {performOperation} from "../../../../models/Operation";
import {Record} from "../../../../models/Record";
import {randomUUID} from "crypto";

export const createRecord = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user.userId;
        const {operation_id, input1, input2} = req.body;

        if (
            !userId ||
            !operation_id ||
            input1 === undefined ||
            input2 === undefined
        ) {
            return res.status(400).json({error: "Missing required parameters"});
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(400).json({error: "User not found"});
        }
        const operation = await getOperationById(operation_id);

        // Check if the user has enough credits to perform the operation
        const userRecords = await getRecordsByUser(userId, 1000);

        const check = checkUserCanCreateRecord(userRecords, user, operation);

        if (!check) {
            return res.status(403).json({error: "Insufficient credits"});
        }

        // Perform the operation, assuming it's an addition for now, this has to be dependent on the operation type
        const result = performOperation(operation, input1, input2);

        // Create the new record
        const newRecord: Record = {
            id: randomUUID(),
            user_id: userId,
            operation_id: operation_id,
            amount: operation.cost,
            user_balance: user.credit,
            operation_response: result as string,
            date: new Date().toISOString(),
        };

        // Save the new record to the database
        await addRecord(newRecord);

        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

