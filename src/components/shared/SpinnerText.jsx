import React from 'react';
import Spinner from "react-bootstrap/Spinner";

const SpinnerText = ({spinning, label}) => {
    return (spinning &&
        (<>
            {label}{` `}
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        </>)
    );
}

export default SpinnerText;