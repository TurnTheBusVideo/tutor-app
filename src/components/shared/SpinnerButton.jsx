import React from 'react';
import Button from 'react-bootstrap/Button';
import SpinnerText from './SpinnerText';

export const SpinnerButton = ({ spinning, label, ...other }) => {
    return (
        <>
            <Button
                disabled={spinning}
                {...other}
            >
                { spinning ? (<SpinnerText spinning={spinning} label={label} />) : label}
            </Button>
        </>
    );
}
