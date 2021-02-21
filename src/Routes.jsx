import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ProtectedApp from './routes/ProtectedApp';
import LoginPage from './routes/LoginPage';
import Logout from './routes/Logout';
import RegistrationPage from './routes/RegistrationPage';
import VerificationPage from './routes/VerificationPage';
import sessionManager from './utils/sessionManager';
import { getSessionCookie } from './utils/sessions';


const Routes = () => {
    const [userData, setUserData] = useState(getSessionCookie());
    const [stickyEmail, setStickyEmail] = useState();

    return (
        <Router >
            <Switch>
                <Route exact path="/login" >
                    <LoginPage afterLogin={setUserData} />
                </Route>
                <Route exact path="/register" >
                    <RegistrationPage afterRegister={setStickyEmail} />
                </Route>
                <Route exact path="/verify" >
                    <VerificationPage stickyEmail={stickyEmail} />
                </Route>
                <Route exact path="/logout">
                    <Logout afterLogout={setUserData} />
                </Route>
                <ProtectedRoute path="/*">
                    <ProtectedApp userData={userData} />
                </ProtectedRoute>
            </Switch>
        </Router>
    );
}

const ProtectedRoute = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                sessionManager.isAuthenticated() ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default Routes;