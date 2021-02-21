import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { Link, useHistory } from 'react-router-dom';
import { centerIt } from '../components/layout/Centered';
import { SpinnerButton } from '../components/shared/SpinnerButton';
import { TTBLogo } from '../components/shared/TTBLogo';
import { toUsername } from '../utils/formUtil';



function RegistrationPage({ afterRegister }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({});
    let history = useHistory();

    let register = async (event) => {
        event.preventDefault();
        if (email && pass && pass2 && pass === pass2) {
            try {
                setSubmitting(true);
                await Auth.signUp({
                    username: toUsername(email),
                    password: pass,
                    attributes: {
                        email,
                        name
                    }
                });
                setSubmitting(false);
                afterRegister(email);
                history.push('/verify');
            } catch (error) {
                setSubmitting(false);
                console.error('error signing up:', error);
                setStatus({
                    type: 'danger',
                    message: `There was an error registering.
                    ${error?.message + '.' || ''}
                     Please check console/network logs or contact administrators.`
                })
            }
        } else {
            setStatus({
                type: 'danger',
                message: 'Some fields are missing'
            })
        }
    };
    return centerIt(
            <>
                <TTBLogo />
                <h1>Register</h1>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="pass">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="password"
                            placeholder="Password"
                            onChange={e => setPass(e.target.value)} />
                        <small id="titleHelpBlock" className="form-text text-muted">
                            Minimum length: 8<br />
                        At least 1 numerical character<br />
                        At least 1 special character<br />
                        At least 1 uppercase character<br />
                        At least 1 lowercase character<br />
                        </small>
                    </Form.Group>

                    <Form.Group controlId="pass2">
                        <Form.Label>Re enter password</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="password"
                            placeholder="Re enter Password"
                            onChange={e => setPass2(e.target.value)} />
                    </Form.Group>
                    <SpinnerButton
                        spinning={submitting}
                        label="Register"
                        variant="primary"
                        type="submit"
                        onClick={e => register(e)}
                    />
                </Form>
                <br />
                {
                    status?.type && status?.message &&
                    <Alert
                        variant={status?.type || 'warning'}
                    >
                        {status?.message || 'Error submitting'}
                    </Alert>
                }
                <Link to="/verify">Verify email</Link>
                <br />
                <Link to="/login">Login</Link>
            </>
    );
}

export default RegistrationPage;
