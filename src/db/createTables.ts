import AWS from "aws-sdk";
import dynamoDb from "./dynamoDbClient";

const createTable = async (params: AWS.DynamoDB.CreateTableInput) => {
  const dynamoDB = new AWS.DynamoDB({
    region: "us-east-1",
    ...(process.env.NODE_ENV === "development" && {
      endpoint: "http://localhost:4566",
    }),
  });

  try {
    await dynamoDB.createTable(params).promise();
    console.log(`Table created: ${params.TableName}`);
  } catch (error) {
    console.error(`Error creating table: ${params.TableName}`, error);
  }
};

const createUsersTable = async () => {
  const params: AWS.DynamoDB.CreateTableInput = {
    TableName: "Users",
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      { AttributeName: "status", AttributeType: "S" },
      { AttributeName: "username", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },

    GlobalSecondaryIndexes: [
      {
        IndexName: "StatusIndex",
        KeySchema: [
          { AttributeName: "status", KeyType: "HASH" },
          { AttributeName: "id", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      {
        IndexName: "UsernameIndex",
        KeySchema: [
          { AttributeName: "username", KeyType: "HASH" },
          { AttributeName: "id", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  };
  await createTable(params);
};

const createOperationsTable = async () => {
  const params: AWS.DynamoDB.CreateTableInput = {
    TableName: "Operations",
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };
  await createTable(params);
};

const createRecordsTable = async () => {
  const recordsTableParams: AWS.DynamoDB.CreateTableInput = {
    TableName: "Records",
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      {
        AttributeName: "userId",
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "userIdIndex",
        KeySchema: [
          {
            AttributeName: "userId",
            KeyType: "HASH",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };
  await createTable(recordsTableParams);
};

export const createTables = async () => {
  try {
    await createUsersTable().catch((error) => {});
    await createOperationsTable().catch((error) => {});
    await createRecordsTable().catch((error) => {});
  } catch (error) {
    console.warn("tables already created");
  }
};

export const dropTables = async () => {
  const dynamoDB = new AWS.DynamoDB({
    region: "us-east-1",
    ...(process.env.NODE_ENV === "development" && {
      endpoint: "http://localhost:4566",
    }),
  });

  try {
    await dynamoDB.deleteTable({ TableName: "Users" }).promise();
    await dynamoDB.deleteTable({ TableName: "Operations" }).promise();
    await dynamoDB.deleteTable({ TableName: "Records" }).promise();

    console.log("Tables dropped");
  } catch (error) {
    console.error("Error dropping tables", error);
  }
};
