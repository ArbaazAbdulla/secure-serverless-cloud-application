import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID is required in path" }),
      };
    }

    const params = {
      TableName: "ServerlessTable",   // 🔴 Replace with your table name
      Key: {
        id: id,
      },
    };

    await ddbDocClient.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item Deleted Successfully",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
