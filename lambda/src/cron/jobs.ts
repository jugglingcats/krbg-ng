import {makeDynamoCall, standardEmailScan, TableName} from "../util/dynamodb-lib";
import {EmailService} from "../util/EmailService";
import {UserProfile} from "../common/UserProfile";

export function CronBeginWeek() {
    return makeDynamoCall("scan", standardEmailScan)
        .then((result: any) => result.Items as UserProfile[])
        .then((profiles: UserProfile[]) => {
            return Promise.all(profiles.map((profile: any) => {
                return EmailService.sendStartOfWeekEmail(profile);
            }));
        });
}

export function CronRollUsers() {
    console.log("Rolling users...");

    // fetch all users option/time then for each of them remove option/time and append to history
    return makeDynamoCall("scan", {
        TableName,
        ProjectionExpression: "email, #option, #time, holiday",
        ExpressionAttributeNames: {'#option': 'option', '#time': 'time'}
    }).then((result: any) => {
        return Promise.all(result.Items.map((r: any) => {
            if (r.holiday) {
                --r.holiday || delete r.holiday;
            }
            return makeDynamoCall("update", {
                TableName,
                AttributeUpdates: {
                    option: {Action: "DELETE"},
                    time: {Action: "DELETE"},
                    friends: {Action: "DELETE"},
                    holiday: r.holiday ? {
                        Action: "PUT",
                        Value: r.holiday
                    } : {
                        Action: "DELETE"
                    },
                    history: {
                        Action: "ADD", Value: [{
                            option: r.option,
                            time: r.time
                        }]
                    }
                },
                Key: {
                    email: r.email
                }
            })
        }))
    })
}

export function CronSendReminder() {
    return makeDynamoCall("scan", standardEmailScan).then((f: any) => {
        const unconfirmed = f.Items.filter((profile: UserProfile) => profile.option === undefined);
        const confirmedCount = f.Items
            .filter((p: UserProfile) => p.option === "yes")
            .reduce((total: number, current: UserProfile) => {
                const friends: number = current.friends || 0;
                return Number(total + 1) + Number(friends);
            }, 0);

        return Promise.all(unconfirmed.map((profile: UserProfile) => {
            return EmailService.sendReminderEmail(profile, confirmedCount);
        }));
    });
}

export function CronSendFinalEmail() {
    return makeDynamoCall("scan", standardEmailScan).then((f: any) => {
        return Promise.all(f.Items.map((profile: UserProfile) => {
            return EmailService.sendFinalEmail(profile, f.Items);
        }))
    })
}

