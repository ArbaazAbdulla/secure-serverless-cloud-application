import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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

    const body = JSON.parse(event.body);
    const { name } = body;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required in body" }),
      };
    }

    const params = {
      TableName: "ServerlessTable",   // 🔴 CHANGE THIS
      Key: {
        id: id,
      },
      UpdateExpression: "set #n = :name",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
      },
      ReturnValues: "ALL_NEW",
    };

    const data = await ddbDocClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item Updated Successfully",
        updatedItem: data.Attributes,
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
