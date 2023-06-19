// src/db/recordsQueries.ts
import {DynamoDB} from "aws-sdk";
import {randomUUID} from "crypto";
import {Record} from "../models/Record";
import dynamoDb from "./dynamoDbClient";

export const addRecord = async (record: Record): Promise<Record> => {
    const item = {id: randomUUID(), ...record, status: "ACTIVE"};
    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "Records",
        Item: item,
    };

    await dynamoDb.put(params).promise();

    return item;
};

export const getAllRecords = async (): Promise<Record[]> => {
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: "Records",
    };

    const result = await dynamoDb.scan(params).promise();
    return result.Items as Record[];
};

export const getRecordsByUser = async (userId: string, limit: number, lastKey?: string): Promise<Record[]> => {

    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: "Records",
        IndexName: "userIdIndex",
        KeyConditionExpression: "user_id = :userId",
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":userId": userId,
            ":status": "ACTIVE",
        },
        ScanIndexForward: false,
        Limit: limit ? limit : 1000,
        ExclusiveStartKey: lastKey ? {id: lastKey} : undefined,
    };

    const result = await dynamoDb.query(params).promise();
    return result.Items as Record[];
};

export const deleteRecordById = async (id: string): Promise<{ id: string }> => {
    const params = {
        TableName: "Records",
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

    await dynamoDb.update(params).promise();

    return {id};
};
