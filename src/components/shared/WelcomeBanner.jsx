import Button from 'react-bootstrap/Button'
import { centerIt } from '../layout/Centered';
import Jumbotron from 'react-bootstrap/Jumbotron'
import React, { useState } from 'react';
import sessionManager from '../../utils/sessionManager';

const BANNER_PROP_NAME = 'show-welcome-banner';

const WelcomeBanner = () => {
    const show = sessionManager.getSessionProp(BANNER_PROP_NAME, true);
    const [showBanner, setShowBanner] = useState(show);
    return ( showBanner && (
        <Jumbotron fluid className="welcome-banner">
            <Button
                aria-label="dismiss banner"
                className="close-btn"
                onClick={() => {
                    sessionManager.setSessionProp(BANNER_PROP_NAME, false);
                    setShowBanner(false);
                }}
                variant="outline-dark"
                size="sm">
                    Dismiss
            </Button> 
            {centerIt(
                <>
                    <h1 className="display-4">स्वागत है</h1>
                    <p className="lead">नमस्ते दोस्तों। टर्न द बस के साथ ऑनलाइन पढ़ाने के लिए धन्यवाद! कृपया इस फॉर्म का उपयोग अपने वीडियो का विवरण प्रस्तुत करने के लिए करें।</p>
                    <p className="lead">Namaste, friends. Thank you for teaching online with Turn the Bus! Please use this form to submit the details of your video.</p>
                    <p className="lead">
                        <Button variant="link" href="https://www.turnthebus.org/" target="_blank">🌐 turnthebus.org</Button>
                    </p>
                </>
            )}
        </Jumbotron>
    )
    )
};


export default WelcomeBanner;
