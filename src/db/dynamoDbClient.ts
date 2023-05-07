// src/db/dynamoDbClient.ts
import AWS from "aws-sdk";

const isLocal = process.env.NODE_ENV === "development";
console.log("isLocal", isLocal);

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  ...(isLocal && {
    endpoint: "http://localhost:4566",
    accessKeyId: "test",
    secretAccessKey: "test",
  }),
});
console.log("dynamo client created");

export default dynamoDb;
