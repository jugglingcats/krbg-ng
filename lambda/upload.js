const AWS = require('aws-sdk');
const path = require("path");
const fs = require('fs');

const types={
    js: "application/javascript",
    html: "text/html",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpeg",
    svg: "image/svg+xml",
    json: "application/json",
    ico: "image/vnd.microsoft.icon",
    map: "application/octet-stream",
    woff: "application/octet-stream",
    woff2: "application/octet-stream",
    ttf: "application/octet-stream",
    eot: "application/vnd.ms-fontobject"
};

function contentType(path) {
    const parts = path.split(".");
    const ext= parts[parts.length-1];
    const type=types[ext];
    if ( !type ) {
        throw new Error("Invalid extension: "+ext+" for "+path);
    }
    return type;
}

const uploadDir = function (s3Path, bucketName) {
    const s3 = new AWS.S3();

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            const filePath = path.join(currentDirPath, name);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function (filePath, stat) {
        const bucketPath = filePath.substring(s3Path.length + 1).replace(/\\/g, "/");
        const params = {
            Bucket: bucketName,
            Key: bucketPath,
            Body: fs.readFileSync(filePath),
            ContentType: contentType(filePath)
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName);
            }
        });

    });
};

if (process.argv.length !== 4) {
    throw new Error("You must specify dir and s3 bucket name")
}
const [, , dir, bucket] = process.argv;
uploadDir(dir, bucket);
