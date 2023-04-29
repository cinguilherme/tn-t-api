// src/db/operationsQueries.ts
import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import { Operation } from "../models/Operation";

const dynamoDb = new DynamoDB.DocumentClient();

export const createOperation = async (
  operation: Operation
): Promise<Operation> => {
  operation.id = randomUUID();
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.OPERATIONS_TABLE,
    Item: operation,
  };

  await dynamoDb.put(params).promise();

  return operation;
};
