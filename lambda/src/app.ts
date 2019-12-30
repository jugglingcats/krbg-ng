import * as ApiBuilder from "claudia-api-builder";
import {registerMiscMethods} from "./methods/misc";
import {CronBeginWeek, CronRollUsers, CronSendFinalEmail, CronSendReminder} from "./cron/jobs";

// export const aws_region = "eu-west-2";

const api = new ApiBuilder();

api.corsMaxAge(60 * 20); // allow cors caching for 20 minutes

registerMiscMethods(api);

// noinspection JSUnusedGlobalSymbols
export const TriggerHandler = {
    process(trigger) {
        console.log("Processing cron trigger: ", trigger);
        switch (trigger) {
            case "RollUsers":
                return CronRollUsers();
            case "BeginWeek":
                return CronBeginWeek();
            case "SendReminder":
                return CronSendReminder();
            case "SendFinalEmail":
                return CronSendFinalEmail();
            default:
                console.log("Unknown trigger type: ", trigger);
        }
    }
};

export default api;