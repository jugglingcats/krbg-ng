export class Environment {
    static get debug(): boolean {
        return Boolean(process.env.DEBUG).valueOf();
    }

    static get stage(): string {
        return {d: "dev", t: "test", l: "live"}[Environment.get("STAGE_NAME", "d")];
    }

    static get validateRecaptcha(): boolean {
        return Environment.is("RECAPTCHA");
    }

    static is(param: string): boolean {
        return process.env[param] === "true";
    }

    static siteLink(page: string) {
        const base = process.env["SITE_URL"];
        if (!base) {
            throw "No SITE_URL environent var"
        }
        return base + "/" + page;
    }

    static get jwtSecret(): string {
        return Environment.get("JWT_SECRET");
    }

    static get recaptchaSecret(): string {
        return Environment.get("RECAPTCHA_SECRET");
    }

    static get(param: string, defaultValue?: string): string {
        let value = process.env[param];
        if (!value) {
            if (!defaultValue) {
                throw new Error("Env variable not defined: " + param);
            }
            value = defaultValue;
            console.log("Used default value for environment variable: ", param, defaultValue);
        }
        return value;
    }
}