import {createOperation} from "../../../../db/operationsQueries";

const removeUser = (body: any) => {
    const {user, ...rest} = body;
    return rest;
};


export const newOperation =     async (req, res) => {
    try {
        const operation = removeUser(req.body);
        const createdOperation = await createOperation(operation);
        res.status(201).json(createdOperation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
