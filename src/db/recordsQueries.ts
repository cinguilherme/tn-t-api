// src/db/recordsQueries.ts
import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import { Record } from "../models/Record";

const dynamoDb = new DynamoDB.DocumentClient();

export const addRecord = async (record: Record): Promise<Record> => {
  record.id = randomUUID();
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.RECORDS_TABLE,
    Item: record,
  };

  await dynamoDb.put(params).promise();

  return record;
};

export const getRecordsByUser = async (userId: string): Promise<Record[]> => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.RECORDS_TABLE,
    IndexName: "userIdIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await dynamoDb.query(params).promise();
  return result.Items as Record[];
};
