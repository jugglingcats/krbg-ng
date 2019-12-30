const {default: api, TriggerHandler} = require("./dist/app");

module.exports = {
    ...api,
    proxyRouter: function (event, context, callback) {
        console.log("EVENT: ", event);
        if (event.krbg_trigger) {
            // event from cloudwatch (cron event)
            TriggerHandler.process(event.krbg_trigger);
        } else {
            api.proxyRouter(event, context, callback);
        }
    }
};
