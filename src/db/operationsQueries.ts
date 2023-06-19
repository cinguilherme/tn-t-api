// src/db/operationsQueries.ts
import {DynamoDB} from "aws-sdk";
import {randomUUID} from "crypto";
import {Operation} from "../models/Operation";

import dynamoDb from "./dynamoDbClient";

export const createOperation = async (
    operation: Operation
): Promise<Operation> => {
    const item = {
        id: randomUUID(),
        ...operation,
        status: "ACTIVE",
    }
    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "Operations",
        Item: item,
    };

    await dynamoDb.put(params).promise();

    return operation;
};

export const getOperationById = async (id: string): Promise<Operation> => {
    const params = {
        TableName: "Operations",
        Key: {
            id,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item as Operation;
    } catch (error) {
        console.error("Error getting operation by ID:", error);
        throw error;
    }
};

export const deleteOperationById = async (id: string): Promise<boolean> => {
    const params = {
        TableName: "Operations",
        Key: {
            id,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": "DELETED",
        },
        ReturnValues: "UPDATED_NEW",
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return !!result;
    } catch (error) {
        console.error("Error getting operation by ID:", error);
        throw error;
    }
};

export const getAllOperations = async (): Promise<Operation[]> => {
    try {
        const params: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: "Operations",
            FilterExpression: "#status = :status",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ExpressionAttributeValues: {
                ":status": "ACTIVE",
            }
        };

        const response = await dynamoDb.scan(params).promise();

        if (response.Items) {
            return response.Items as Operation[];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting all operations:", error.message);
        throw error;
    }
};
