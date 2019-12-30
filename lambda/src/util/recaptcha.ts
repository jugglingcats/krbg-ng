import * as http from "https";
import {Environment} from "./env";

export async function validateRecaptcha(code: string) {
    if (!Environment.validateRecaptcha) {
        console.log("Recaptcha check skipped in config");
        return Promise.resolve();
    }

    const recaptchaSecret = Environment.recaptchaSecret;

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + recaptchaSecret + "&response=" + code;
    console.log("Checking recaptcha...", code);
    return new Promise((resolve, reject) => {
        http.get(verificationUrl, function (res: any) {
            if (res.statusCode != 200) {
                console.log("Recaptcha failed");
                reject("Recaptcha failed!");
                return;
            }
            let rawData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk: any) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    console.log("Recaptcha response:", parsedData);
                    if (parsedData.success) {
                        console.log("Recaptcha ok");
                        resolve();
                    } else {
                        reject("Recaptcha validation failed");
                    }
                } catch (e) {
                    console.error("Error processing recaptcha response:", e.message);
                    reject(e.message);
                }
            });
        });
    });
}