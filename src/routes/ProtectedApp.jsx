import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link, NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { TTBLogo } from '../components/shared/TTBLogo';
import sessionManager from '../utils/sessionManager';
import UploadPage from './UploadPage';
import HistoryPage from './HistoryPage';

function ProtectedApp({ userData }) {
    const location = useLocation();
    const {email, name} = userData;
    if (!email) {
        return (
            <Alert variant='warning'>
                Some error getting your data.
                Please <Link to='/login'> login again. </Link>
            </Alert>
        );
    }

    const displayedUserDetails =  name && email ? `${userData.name}(${userData.email})` : email;

    return (
        <>
            <ToastProvider placement='bottom-center' >
                <div className="d-flex flex-column app-ctr-lvl-1">
                    <Navbar bg="light" expand="sm" sticky="top" className="top-nav" >
                        <Navbar.Brand>
                            <TTBLogo />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                        >
                            <Nav
                                defaultActiveKey="/admin"
                                className="mr-auto" 
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}>
                                {
                                    sessionManager.isTutor() && (
                                        <>
                                            <Nav.Link className={location.pathname === '/upload' ? 'active-top-route' : ''} href="/upload">Upload</Nav.Link>
                                            <Nav.Link className={location.pathname === '/history' ? 'active-top-route' : ''} href="/history">History</Nav.Link>
                                           
                                            {/* <Nav.Item className='nav-link'>
                                                <NavLink activeClassName="active-top-route" to="/upload" >Upload</NavLink>
                                            </Nav.Item >
                                            <Nav.Item className='nav-link'>
                                                <NavLink activeClassName="active-top-route" to="/history" >History</NavLink>
                                            </Nav.Item> */}
                                        </>
                                    )
                                }
                                {
                                    sessionManager.isAdmin() &&
                                    (
                                        <Nav.Item className='nav-link'>
                                            <NavLink activeClassName="active-top-route" to="/admin" >Administration</NavLink>
                                        </Nav.Item>
                                    )
                                }
                            </Nav>
                                <Navbar.Text>
                                    { displayedUserDetails }
                                </Navbar.Text>
                            <Nav>
                                {/* <Nav.Item className='nav-link'>
                                    <CopyToClipboard text={sessionManager.getAuthToken()}>
                                        <Button size="sm" variant="outline-dark" > Copy JWT <span role='img' aria-label='key emoji'>🔑</span></Button>
                                    </CopyToClipboard>
                                </Nav.Item> */}
                                <Nav.Link href="/logout">Sign out</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <ProtectedAppBody userData={userData} />
                    <footer style={{ 
                        marginTop: '4em'
                    }}
                    className="ttb-container">
                        <Container>
                            <Row style={{
                                display: 'block'
                            }}>
                                Turn the Bus is a registered 501 (c) (3) US nonprofit organization.
                            </Row>
                        </Container>
                    </footer>
                </div>
            </ToastProvider>
        </>
    );
}

const ProtectedAppBody = ({ userData }) => {
    return (
        <main className='flex-grow-1'>
            <Switch>
                <Route path="/upload">
                    <UploadPage />
                </Route>
                <Route path="/history">
                    <HistoryPage />
                </Route>
            </Switch>
        </main>
    )
}

export const AdminRoute = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                sessionManager.isAdmin() ? (
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

export default ProtectedApp;
