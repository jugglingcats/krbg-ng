import * as AWS from 'aws-sdk';
import {Environment} from "./env";

// import {aws_region} from "../app";

// AWS.config.update({region: aws_region});

export const TableName = `krbg-${Environment.stage}-users`;

export const standardEmailScan = {
    TableName,
    FilterExpression: "attribute_not_exists(holiday)"
};

export function makeDynamoCall(action: string, params: any) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient({region: "eu-west-2"}) as any;
    if (!dynamoDb[action]) {
        console.log("DynamoDb function does not exist: ", action, dynamoDb);
    }
    return dynamoDb[action](params).promise();
}