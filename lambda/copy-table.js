var copy = require('copy-dynamodb-table').copy

var globalAWSConfig = { // AWS Configuration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'eu-west-1'
}

var sourceAWSConfig = {
    accessKeyId: "AKIAIUYEVYPJEWVW3Y5A",
    secretAccessKey: "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",
    region: 'eu-west-1'
}

var destinationAWSConfig = {
    accessKeyId: "AKIAIUYEVYPJEWVW3Y5A",
    secretAccessKey: "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",
    region: 'eu-west-2' // support cross zone copying
}

copy({
        config: globalAWSConfig,
        source: {
            tableName: 'ClubUsers', // required
            config: sourceAWSConfig // optional , leave blank to use globalAWSConfig
        },
        destination: {
            tableName: 'krbg-live-users', // required
            config: destinationAWSConfig // optional , leave blank to use globalAWSConfig
        },
        log: true,// default false
        create: false // create destination table if not exist
    },
    function (err, result) {
        if (err) {
            console.log(err)
        }
        console.log(result)
    }
);