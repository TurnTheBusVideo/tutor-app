/* eslint-disable jsx-a11y/accessible-emoji */
import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { TTBLogo } from '../components/shared/TTBLogo';
import { SpinnerButton } from '../components/shared/SpinnerButton';
import { centerIt } from '../components/layout/Centered';
import { toUsername } from '../utils/formUtil';


function VerificationPage({ stickyEmail }) {
    const [email, setEmail] = useState(stickyEmail || '');
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({});

    let register = async (event) => {
        event.preventDefault();
        if (email && code) {
            try {
                setSubmitting(true);
                await Auth.confirmSignUp(toUsername(email), code);
                setSubmitting(false);
                setStatus({
                    type: 'success',
                    message: '✅ Your account has been verified. Please wait for admins to enable your account.'
                })
            } catch (error) {
                console.error('error verifying:', error);
                setSubmitting(false);
                setStatus({
                    type: 'danger',
                    message: `There was an error verifying your account.
                    ${error?.message || ''}
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
                <h1>Email Verification</h1>
                <p>
                    We have sent an email with the verification code to your registered email address. 📬
                </p>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="code">
                        <Form.Label>Verification Code</Form.Label>
                        <Form.Control
                            disabled={submitting}
                            type="text"
                            placeholder="Enter the code sent to your email address"
                            value={code}
                            onChange={e => setCode(e.target.value)} />
                    </Form.Group>
                    <SpinnerButton
                        spinning={submitting}
                        label="Verify Email"
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
                <br />
                <Link to="/login">Login</Link>
                <br />
                <Link to='/register'>Register</Link>
            </>
    );
}

export default VerificationPage;
