import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  const body = JSON.parse(event.body);

  const params = {
    TableName: "ServerlessTable",
    Item: {
      id: Date.now().toString(),
      name: body.name,
      price: body.price
    }
  };

  await docClient.send(new PutCommand(params));

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ message: "Item Created Successfully" })
  };
};
