import { getSessionCookie, setSessionCookie } from './sessions';
const sessionManager = {
    getSession: () => getSessionCookie('tutor-session'),
    setSession: (obj) => setSessionCookie(obj),
    getSessionProp: (propName, defaultPropValue = false) => sessionManager.isAuthenticated()
        ? (
            Object.keys(sessionManager.getSession()).indexOf(propName) !== -1
                ? sessionManager.getSession()[propName]
                : defaultPropValue
            )
        : defaultPropValue,
    setSessionProp: (propName, value) => {
        sessionManager.isAuthenticated() && sessionManager.setSession({
            ...sessionManager.getSession(),
            [propName]: value
        })
    },
    isAuthenticated: () => sessionManager.getSession()?.email || false,
    isAdmin: () => sessionManager.getSessionProp('isAdmin'),
    isTutor: () => sessionManager.getSessionProp('isTutor', true),
    getAuthToken: () => sessionManager.getSessionProp('authToken'),
    getUsername: () => sessionManager.getSessionProp('email'),
    getName:  () => sessionManager.getSessionProp('name'),
};

export default sessionManager;