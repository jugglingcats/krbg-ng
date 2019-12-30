import {makeDynamoCall, TableName} from "./dynamodb-lib";
import {UserProfile} from "../common/UserProfile";

export const standardProjection="username, surname, email, #option, verificationKey, #roles, #time, holiday, friends, useSurname";
export const expressionAttributeNames={
    '#option': 'option',
    '#roles': 'roles',
    '#time': 'time'
};

export function loadProfile(key: string, requiredRole?: string): Promise<UserProfile> {
    const params = {
        TableName,
        FilterExpression: "verificationKey = :val",
        ExpressionAttributeValues: {
            ":val": key
        },
        ProjectionExpression: standardProjection,
        ExpressionAttributeNames: expressionAttributeNames
    };

    return makeDynamoCall("scan", params).then((r: any) => {
        if (r.Count == 0) {
            console.error("Key verification failed: ", key);
            return Promise.reject({message: "Key verification failed. Perhaps account was deleted?"});
        }
        let item = r.Items[0] as UserProfile;
        if (requiredRole && !item.roles.some(r => r === requiredRole)) {
            console.error("User does not have required role: ", key);
            return Promise.reject({message: "You do not have the required role to perform this operation"});
        }
        return item;
    })
}
