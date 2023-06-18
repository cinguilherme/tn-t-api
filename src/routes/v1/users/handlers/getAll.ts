import {BuildUserQueryParams, getUsers} from "../../../../db/userQueries";

export const getAll = async (req, res) => {
    try {
        const queryParams: BuildUserQueryParams = {
            status: 'active',
        };
        const users = await getUsers(queryParams);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({error: "Error getting users"});
    }
}