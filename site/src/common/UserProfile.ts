import {AttendanceOption} from "./AttendanceOption";

export enum TimeOption {
    t2000 = "8pm",
    t2030 = "8.30pm",
    t2100 = "9pm",
    t2130 = "9.30pm"
}

export function userFriendlyName(profile: UserProfile) {
    // console.log("Build user name for ",profile.username,"+[",profile.surname+"]");

    if ( profile.surname && profile.useSurname ) {
        return profile.username + " " + profile.surname;
    }
    if (profile.surname && profile.surname.length) {
        return profile.username + " " + profile.surname.charAt(0);
    }
    return profile.username;
}

export type UserProfileRegistration = {
    username: string,
    surname?: string,
    email: string,
}

export type UserProfile = UserProfileRegistration & {
    option?: AttendanceOption,
    verificationKey: string,
    roles: string[]
    time?: TimeOption,
    holiday?: number,
    friends?: number,
    created: number,
    useSurname?: boolean
}