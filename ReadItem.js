import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    const id = event.pathParameters.id;

    const params = {
        TableName: "ServerlessTable",
        Key: {
            id: { S: id }
        }
    };

    try {
        const data = await client.send(new GetItemCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error retrieving item" })
        };
    }
};
