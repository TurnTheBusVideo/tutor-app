import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Link, useHistory } from 'react-router-dom';
import { SpinnerButton } from '../components/shared/SpinnerButton';
import { TTBLogo } from '../components/shared/TTBLogo';
import { setSessionCookie } from '../utils/sessions';
import { centerIt } from '../components/layout/Centered';
import { toUsername } from '../utils/formUtil';

function LoginPage({ afterLogin }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({});
    const history = useHistory();

    const login = async (event) => {
        event.preventDefault();
        if (email && pass) {
            try {
                setSubmitting(true);
                const signInResult = await Auth.signIn(toUsername(email), pass);
                // const groups = signInResult?.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
                const token = signInResult?.signInUserSession?.idToken?.jwtToken || '';
                const cookieObj = {
                    email,
                    name: signInResult?.attributes?.name,
                    authToken: token,
                    showWelcomeBanner: true
                };
                setSessionCookie(cookieObj);
                afterLogin(cookieObj);
                setSubmitting(false);
                history.push('/upload');
            } catch (error) {
                console.error('error signing in', error);
                setSubmitting(false);
                if (error?.message === 'User is disabled.') {
                    setStatus({
                        type: 'warning',
                        message: 'Your account is pending activation by administrators. 🔒'
                    })

                } else {
                    setStatus({
                        type: 'danger',
                        message: `There was an error logging in.
                        ${error?.message || ''}
                        Please check console/network logs or contact administrators.`
                    })
                }
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
                    <h1>Video Upload Sign-in</h1>
                    <Row className="h-100">
                        <Col>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        disabled={submitting}
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        disabled={submitting}
                                        type="password"
                                        placeholder="Password"
                                        onChange={e => setPass(e.target.value)} />
                                </Form.Group>
                                <SpinnerButton
                                    spinning={submitting}
                                    label="Login"
                                    variant="primary"
                                    type="submit"
                                    onClick={e => login(e)}
                                />
                            </Form>
                        </Col>
                        <Col />
                    </Row>
                    <br />
                    {
                        status?.type && status?.message &&
                        <Alert
                            variant={status?.type || 'warning'}
                        >
                            {status?.message || 'Error submitting'}
                        </Alert>
                    }
                    <br />
                    <Link to="/register">Register</Link>
                    <br />
                    <Link to="/verify">Verify email</Link>
                </>
    );
}

export default LoginPage;
