import { Auth } from 'aws-amplify';
import Cookies from "js-cookie";
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { emptySessionObj } from '../utils/sessions';

const Logout = ({ afterLogout }) => {
    let history = useHistory();

    useEffect(
        () => {
            Cookies.remove("tutor-session");
            Auth.signOut();
            afterLogout(emptySessionObj);
            history.push("/login");
        },
        [history, afterLogout]
    );

    return <div>Logging out!</div>;
};

export default Logout;