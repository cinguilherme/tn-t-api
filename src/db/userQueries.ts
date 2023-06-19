// src/db/userQueries.ts
import {User} from "../models/User";
import dynamoDb from "./dynamoDbClient";

export const createUser = async (user: User): Promise<User> => {
    const params = {
        TableName: "Users",
        Item: {...user, status: "ACTIVE"},
    };

    try {
        await dynamoDb.put(params).promise();
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    const params = {
        TableName: "Users",
        Key: {
            id,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item as User | null;
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw error;
    }
};

export const getUserByUsername = async (
    username: string
): Promise<User | null> => {
    const params = {
        TableName: "Users",
        IndexName: "UsernameIndex",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    };

    try {
        const result = await dynamoDb.query(params).promise();
        return result.Items?.[0] as User | null;
    } catch (error) {
        console.error("Error getting user by username:", error);
        return null;
    }
};

export const deleteUserById = async (id: string): Promise<User | null> => {
    const params = {
        TableName: "Users",
        Key: {
            id,
        },
        UpdateExpression: "SET #status = :deleted",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":deleted": "DELETED",
        },
        ReturnValues: "ALL_NEW",
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return result.Attributes as User | null;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const updateUser = async (
    user: Partial<User> & { id: string }
): Promise<User | null> => {
    const updateExpressionArray = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    for (const key in user) {
        if (key !== "id") {
            updateExpressionArray.push(`#${key} = :${key}`);
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = user[key];
        }
    }

    const updateExpression = `SET ${updateExpressionArray.join(", ")}`;

    const params = {
        TableName: "Users",
        Key: {
            id: user.id,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    console.log("params:", params);

    try {
        const result = await dynamoDb.update(params).promise();
        return result.Attributes as User | null;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export interface BuildUserQueryParams {
    status?: string;
    username?: string;
    limit?: number;
    exclusiveStartKey?: string;
}

const buildUserQuery = (
    queryParams: BuildUserQueryParams
): AWS.DynamoDB.DocumentClient.QueryInput => {
    let indexName: string | undefined;
    let keyConditionExpression: string;
    let filterExpression: string | undefined;
    let expressionAttributeNames: { [key: string]: string } | undefined;
    let expressionAttributeValues: { [key: string]: any };

    if (queryParams.status) {
        indexName = "StatusIndex";
        keyConditionExpression = "#status = :status";
        expressionAttributeNames = {"#status": "status"};
        expressionAttributeValues = {":status": queryParams.status};

        if (queryParams.username) {
            filterExpression = "contains(username, :username)";
            expressionAttributeValues[":username"] = queryParams.username;
        }
    } else if (queryParams.username) {
        indexName = "UsernameIndex";
        keyConditionExpression = "#username = :username";
        expressionAttributeNames = {"#username": "username"};
        expressionAttributeValues = {":username": queryParams.username};
    } else {
        throw new Error(
            "At least one of the query parameters status or username must be provided"
        );
    }

    return {
        TableName: "Users",
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: queryParams.limit,
        ExclusiveStartKey: queryParams.exclusiveStartKey
            ? {id: queryParams.exclusiveStartKey}
            : undefined,
    };
};

export const getUsers = async (
    queryParams: BuildUserQueryParams
): Promise<{ users: User[]; lastEvaluatedKey?: string }> => {
    const query = buildUserQuery(queryParams);

    try {
        const result = await dynamoDb.query(query).promise();
        return {
            users: result.Items as User[],
            lastEvaluatedKey: result.LastEvaluatedKey
                ? result.LastEvaluatedKey.id
                : undefined,
        };
    } catch (error) {
        console.error("Error getting users:", error);
        throw error;
    }
};
