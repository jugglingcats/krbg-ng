import {action, observable} from "mobx";
import {AttendanceOption} from "./common/AttendanceOption";
import {TimeOption, UserProfile, UserProfileRegistration} from "./common/UserProfile";

function stage() {
    switch (window.location.hostname) {
        case "www.krbg.uk":
        case "krbg.uk":
            return "l";
        case "test.krbg.uk":
            return "t";
        default:
            return "d";
    }
}

export const STAGE_NAME = stage();

export function isLive() {
    return STAGE_NAME === "l";
}

export type ControllerProps = {
    controller: AppController;
}

export type VerifiedPageState = {
    verified: boolean,
    profile?: UserProfile,
}

type ResponseHandler = {
    [status: number]: (r: Response) => Promise<any>
}

const API = `https://api.krbg.uk/${STAGE_NAME}/`;

export class AppController {
    @observable
    error: boolean = false;

    @observable
    errorText: string = "";

    @observable
    busy: boolean = false;

    @observable
    verified: VerifiedPageState = {verified: false};

    private static doFetch(method: string, path: string, args: any): Promise<any> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        switch (method) {
            case "GET":
                return fetch(API + path, {
                    method: "GET",
                });
            case "POST":
                return fetch(API + path, {
                    method: "POST",
                    body: JSON.stringify(args),
                    headers: headers
                });
            default:
                throw new Error("Unknown method: " + method);
        }
    }

    private request(method: string, path: string, args: any, handler: ResponseHandler): Promise<any> {
        this.busy = true;
        return AppController.doFetch(method, path, args).then(r => {
            this.busy = false;
            if (handler[r.status]) {
                return handler[r.status](r)
            }
            if (r.status === 200) {
                return r.json();
            }
            return r.json().then((t: any) => {
                return this.setError(t.errorMessage);
            });
        }).catch((e: Error) => {
            this.busy = false;
            return this.setError(e.message);
        });
    }

    private post(path: string, args: any, handler: ResponseHandler = {}): Promise<Response | any> {
        return this.request("POST", path, args, handler);
    }

    private get(path: string, handler: ResponseHandler = {}): Promise<any> {
        return this.request("GET", path, {}, handler);
    }

    @action
    public setError(text: string) {
        this.error = true;
        this.errorText = text;
        return Promise.reject(text); // error page will show in any case, let components do cleanup
    }

    @action
    public clearError() {
        this.error = false;
        this.errorText = "";
    }

    @action
    public storeOption(option: AttendanceOption): Promise<any> {
        return this.post("storeOption", {
            key: this.verified.profile!.verificationKey,
            option: option
        }).then((profile: UserProfile) => {
            this.verified.profile = profile;
        });
    }

    @action
    public storeTimeOption(time?: TimeOption): Promise<void> {
        return this.post("storeTimeOption", {
            key: this.verified.profile!.verificationKey,
            time: time
        }).then((profile: UserProfile) => {
            this.verified.profile = profile;
        });
    }

    @action
    public storeHoliday(holiday?: number): Promise<void> {
        return this.post("storeHoliday", {
            key: this.verified.profile!.verificationKey,
            holiday: holiday
        }).then((profile: UserProfile) => {
            this.verified.profile = profile;
        });
    }

    @action
    public storeFriends(friends?: number): Promise<void> {
        return this.post("storeFriends", {
            key: this.verified.profile!.verificationKey,
            friends: friends
        }).then((profile: UserProfile) => {
            this.verified.profile = profile;
        });
    }

    @action
    public storeUserDetails(username: string, surname?: string): Promise<void> {
        return this.post("storeUserDetails", {
            key: this.verified.profile!.verificationKey,
            username: username,
            surname: surname
        }).then((profile: UserProfile) => {
            this.verified.profile = profile;
        });
    }

    @action
    public signup(info: UserProfileRegistration & { recaptcha: string }): Promise<{ exists: boolean, token?: string, profile?: UserProfile }> {
        const handler = {
            409: (r: Response) => {
                return r.json().then((obj: any) => {
                    return Promise.resolve({
                        exists: true,
                        token: obj.token
                    })
                })
            }
        };
        return this.post("signup", {
            username: info.username,
            email: info.email,
            recaptcha: info.recaptcha
        }, handler).then((r: any) => {
            if (r.exists) {
                return r;
            }
            return {exists: false, profile: r}
        });
    }

    @action
    public requestEmail(info: any): Promise<void> {
        return this.post("resendEmail", info);
    }

    @action
    public unsubscribe(): Promise<void> {
        return this.post("unsubscribe", {
            key: this.verified.profile!.verificationKey
        }).then(() => {
            this.verified.verified = false;
            this.verified.profile = undefined;
        })
    }

    hasRole(role?: string): boolean {
        if (!this.verified) {
            return false;
        }
        if (!role) {
            return true;
        }
        return this.verified.profile!.roles.some(r => r === role);
    }

    checkUser(key: string) {
        return this.verified && this.verified.verified &&
            this.verified.profile && this.verified.profile.verificationKey === key;
    }

    @action
    public verify(key: string, requiredRole?: string): Promise<VerifiedPageState> {
        if (this.checkUser(key) && this.hasRole(requiredRole)) {
            return Promise.resolve(this.verified);
        }

        return this.get("verify?key=" + key).then((profile: UserProfile) => {
            this.verified = {
                verified: true,
                profile: profile
                // key: key,
                // option: profile.option,
                // email: profile.email,
                // name: profile.username
            };
            return this.verified;
        });
    }

    @action
    public turnout(): Promise<Array<any>> {
        return this.get("turnout?key=" + this.verified.profile!.verificationKey).then(r => r.result);
    }

    public rollUsers(): Promise<void> {
        return this.post("rollUsers", {key: this.verified.profile!.verificationKey});
    }

    public sendBeginWeekEmail(): Promise<void> {
        return this.post("sendBeginWeekEmail", {key: this.verified.profile!.verificationKey});
    }

    public sendReminderEmail(): Promise<void> {
        return this.post("sendReminderEmail", {key: this.verified.profile!.verificationKey});
    }

    public sendFinalEmail(): Promise<void> {
        return this.post("sendFinalEmail", {key: this.verified.profile!.verificationKey});
    }

    public sendCustomEmail(text: string, allUsers: boolean): Promise<void> {
        return this.post("sendCustomEmail", {key: this.verified.profile!.verificationKey, text: text, allUsers: allUsers});
    }
}