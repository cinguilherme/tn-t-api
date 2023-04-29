// src/db/operationsQueries.ts
import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import { Operation } from "../models/Operation";

import dynamoDb from "./dynamoDbClient";

export const createOperation = async (
  operation: Operation
): Promise<Operation> => {
  operation.id = randomUUID();
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: "Operations",
    Item: operation,
  };

  await dynamoDb.put(params).promise();

  return operation;
};

export const deleteOperationById = async (id: string): Promise<boolean> => {
  const params = {
    TableName: "Operations",
    Key: {
      id,
    },
  };

  try {
    const result = await dynamoDb.delete(params).promise();
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
