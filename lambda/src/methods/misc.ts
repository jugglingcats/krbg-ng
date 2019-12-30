import * as ApiBuilder from "claudia-api-builder";
import {expressionAttributeNames, loadProfile, standardProjection} from "../util/keyVerification";
import {makeDynamoCall, standardEmailScan, TableName} from "../util/dynamodb-lib";
import {Environment} from "../util/env";
import {UserProfile} from "../common/UserProfile";
import {validateRecaptcha} from "../util/recaptcha";
import {EmailService} from "../util/EmailService";
import * as jwt from "jsonwebtoken";
import {success} from "../util/response-lib";
import {CronBeginWeek, CronRollUsers, CronSendFinalEmail, CronSendReminder} from "../cron/jobs";

const uuid = require('uuid');

async function authorize(request) {
    const key = request.queryString ? request.queryString.key : undefined;
    if (!key) {
        throw new Error("Key not provided in request");
    }
    return await loadProfile(key);
}

async function update_profile(key, updates) {
    const profile = await loadProfile(key);
    const params = {
        TableName,
        AttributeUpdates: updates,
        Key: {email: profile.email}
    };

    await makeDynamoCall("update", params);
    return success(await loadProfile(key));
}

export function registerMiscMethods(api: ApiBuilder) {
    api.get("/verify", authorize);

    api.get("/turnout", async function (request) {
        await authorize(request);
        const people = await makeDynamoCall("scan", {
                TableName,
                ProjectionExpression: standardProjection,
                ExpressionAttributeNames: expressionAttributeNames
            }
        );
        const result = people.Items.map(({username, surname, option, friends, time}) => ({
            username, surname, option, friends, time
        }));
        return success({result});
    });

    api.post("/signup", async function (request) {
        const jwtSecret = Environment.jwtSecret;

        const data = request.body;
        const timestamp = new Date().getTime();
        console.log("New signup: ", data);

        let verificationKey = uuid.v1();

        const profile: UserProfile = {
            username: data.username,
            surname: data.surname,
            email: data.email,
            verificationKey: verificationKey,
            roles: [],
            created: timestamp,
        };

        await validateRecaptcha(data.recaptcha);
        const params = {
            TableName,
            Expected: {
                email: {
                    Exists: false
                }
            },
            Item: profile
        };

        console.log("Adding new profile: ", data.email);
        try {
            await makeDynamoCall("put", params);
        } catch (e) {
            if (e.code === "ConditionalCheckFailedException") {
                const token = jwt.sign({}, jwtSecret, {expiresIn: '1h'});
                throw new ApiBuilder.ApiResponse(JSON.stringify({ok: false, body: {token}}), {'Content-Type': 'application/json'}, 409);
            } else {
                throw e;
            }
        }
        await EmailService.sendWelcomeEmail(profile);
        return success(profile);
    });

    api.post("/resendEmail", async function (request) {
        const data = request.body;
        const jwtSecret = Environment.jwtSecret;

        jwt.verify(data.token, jwtSecret);
        const params = {
            TableName,
            Key: {
                email: data.email
            }
        };
        const result = await makeDynamoCall("get", params);
        await EmailService.sendWelcomeEmail(result.Item);

        return success();
    });

    api.post("/unsubscribe", async function (request) {
        const {key} = request.body;

        const profile = await loadProfile(key);
        const params = {
            TableName,
            Key: {
                email: profile.email
            }
        };

        await makeDynamoCall("delete", params);
        return success();
    });

    api.post("/storeOption", async function (request) {
        const {key, option} = request.body;

        return await update_profile(key, {
            option: {Action: "PUT", Value: option}
        });
    });

    api.post("/storeTimeOption", async function (request) {
        const {key, time} = request.body;

        return await update_profile(key, {
            time: time ? {
                Action: "PUT",
                Value: time
            } : {
                Action: "DELETE"
            }
        });
    });

    api.post("/storeHoliday", async function (request) {
        const {key, holiday} = request.body;

        return await update_profile(key, {
            holiday: holiday ? {
                Action: "PUT",
                Value: holiday
            } : {
                Action: "DELETE"
            }
        });
    });

    api.post("/storeFriends", async function (request) {
        const {key, friends} = request.body;

        return await update_profile(key, {
            friends: friends ? {
                Action: "PUT",
                Value: friends
            } : {
                Action: "DELETE"
            }
        });
    });

    api.post("/storeUserDetails", async function (request) {
        const {key, username, surname} = request.body;

        return await update_profile(key, {
            username: {
                Action: "PUT",
                Value: username
            },
            surname: surname ? {
                Action: "PUT",
                Value: surname
            } : {
                Action: "DELETE"
            }
        });
    });

    api.post("/sendCustomEmail", async function (request) {
        const {key, text, allUsers} = request.body;
        const scan = allUsers ? {TableName} : standardEmailScan;

        await loadProfile(key, "admin");
        const result = await makeDynamoCall("scan", scan);
        await Promise.all(
            result.Items.map((profile: UserProfile) => EmailService.sendCustomEmail(profile, text))
        );
        return success();
    });

    api.post("/sendBeginWeekEmail", async function (request) {
        const {key} = request.body;

        await loadProfile(key, "admin");
        await CronBeginWeek();
        return success();
    });

    api.post("/rollUsers", async function (request) {
        const {key} = request.body;

        await loadProfile(key, "admin");
        await CronRollUsers();
        return success();
    });

    api.post("/sendReminderEmail", async function (request) {
        const {key} = request.body;

        await loadProfile(key, "admin");
        await CronSendReminder();
        return success();
    });

    api.post("/sendFinalEmail", async function (request) {
        const {key} = request.body;

        await loadProfile(key, "admin");
        await CronSendFinalEmail();
        return success();
    });
}