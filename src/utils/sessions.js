import React from "react";
import * as Cookies from "js-cookie";
export const emptySessionObj = {};
export const setSessionCookie = (session) => {
    Cookies.remove("user-session");
    Cookies.set("user-session", session, { expires: 14 });
};

export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("user-session");
    if (sessionCookie === undefined) {
        return emptySessionObj;
    } else {
        try {
            const sessionObject = JSON.parse(sessionCookie);
            return sessionObject;
        } catch (e) {
            console.error('Corrupted session cookie');
            Cookies.remove("user-session");
            return emptySessionObj;
        }
    }
};

export const SessionContext = React.createContext(getSessionCookie());
