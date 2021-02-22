import { Col, Form } from 'react-bootstrap';
import React from 'react';

export const toUsername = (email) => {
    return email.replace('@', '-at-');
}

export const renderOptions = (objs, value, display) => {
    const optionsComp = [
        <option key='empty-option' value=''>Please select</option>
    ];
    objs.forEach(obj => {
        optionsComp.push(<option key={obj[value]} value={obj[value]}>{obj[display]}</option>)
    }
    );
    return (<>
        {optionsComp}
    </>);
}

export const toUniqueArray = (objArr, key) => {
    let arrayOfKeys = [];
    objArr.forEach(obj => {
        arrayOfKeys[obj[key]] = '';
    })
    return Object.keys(arrayOfKeys);
}

export const toOptions = (arr, withEmpty = false) => {
    const optionsComp = withEmpty ? [
        <option key='empty-option' value=''>Please select</option>
    ] : [];

    arr.forEach(obj => {
        optionsComp.push(<option key={obj} value={obj}>{obj}</option>)
    }
    );
    return (<>
        {optionsComp}
    </>);
}

export const controlSwitch = ({
    controlType,
    controlProps,
    required,
    selectFrom,
}) => {
    switch(controlType) {
        case 'select':
            return (<Form.Control
                {...controlProps}
                as={controlType}
                required={required}
            >
                    {selectFrom && toOptions(selectFrom)}
            </Form.Control>)
        case 'file':
            return (
                <Form.File 
                    {...controlProps}
                    // custom
                    required={required}
                />
            )
        default:
            return (<Form.Control
                {...controlProps}
                as={controlType}
                required={required}
            />);
    }
}

export const FormikControl = ({
    horizontal,
    displayName,
    required,
    id,
    controlType,
    selectFrom,
    helpText,
    learnMore,
    touched,
    errors,
    ...controlProps
}) => {
    const formGroupProps = {};
    if(horizontal) {
        formGroupProps['as'] = Col;
    }
    // console.debug(controlProps ? controlProps.name : 'non', errors);
    return (
        <Form.Group controlId={id} {...formGroupProps}>
                <Form.Label>{displayName}</Form.Label>
                {required && <span className="red">*</span>}
                { controlSwitch({
                    controlType,
                    controlProps,
                    required,
                    selectFrom,
                })}
                {
                    errors &&
                    errors[controlProps.name] 
                    ? (
                        <Form.Control.Feedback type="invalid">
                            {errors[controlProps.name]}
                        </Form.Control.Feedback>
                    ) : ''
                }
                <Form.Text muted>
                    {typeof helpText === 'function' ? helpText() : (helpText || '')}
                    {learnMore ? (
                        <>
                            {` `}<a target="_blank" rel="noopener noreferrer" href={learnMore}>Learn more</a>
                        </>
                    ): ''}
                </Form.Text>
        </Form.Group>
    );
}

export const FormikSelect = (props) => {
    return (
        <FormikControl {...props} controlType="select" />
    )
}

export const FormikFile = (props) => {
    return (
        <FormikControl {...props} controlType="file" />
    )
}

export const renderControl = (fieldData, index, values, handleChange, validationProps) => {
    const {
        type,
        fieldName,
        formFieldId,
        ...other
    } = fieldData;
    return (
        fieldName
        && formFieldId
        && type
        ? (<FormikControl
            {...validationProps}
            {...other}
            key={`${formFieldId}-${index}`}
            controlType={type}
            displayName={fieldName}
            id={formFieldId}
            name={formFieldId}
            value={values[formFieldId]}
            onChange={handleChange}
        />) : 'Error rendering field');
}

export const renderSelect = (fieldData, index, formikValues, handleChange, horizontal) => {
    const {
        fieldName,
        formFieldId,
        values,
        ...other
    } = fieldData;
    return (
        fieldName
        && formFieldId
        && values
        ? (<FormikSelect
            {...other}
            key={`${formFieldId}-${index}`}
            displayName={fieldName}
            id={formFieldId}
            name={formFieldId}
            value={formikValues[formFieldId]}
            onChange={handleChange}
            selectFrom={values?.split(',')}
        />) : 'Error rendering select field.');
}

export const renderFile = (fieldData, index, formikValues, handleChange, validationProps) => {
    const {
        fieldName,
        formFieldId,
        ...other
    } = fieldData;
    // console.debug('renderFile', fieldName, validationProps);
    return (
        fieldName
        && formFieldId
        ? (<FormikFile
            {...validationProps}
            {...other}
            key={`${formFieldId}-${index}`}
            displayName={fieldName}
            id={formFieldId}
            name={formFieldId}
            value={formikValues[formFieldId]}
            onChange={handleChange}
        />) 
        : 'Error rendering file field'
    )
}

export const renderFields = ({
    fields,
    handleChange,
    horizontal = false,
    values,
    ...other
}) => {
    if(fields?.length) {
        return fields.map((fieldData, index) => {
            switch(fieldData?.type) {
                case 'select': {
                    return renderSelect({
                        horizontal,
                        ...fieldData
                    }, index, values, handleChange)
                }
                case 'file': {
                    return renderFile({
                        horizontal,
                        ...fieldData
                    }, index, values, handleChange, other)
                }
                default:
                    return renderControl({
                        horizontal,
                        ...fieldData,
                    }, index, values, handleChange, other)
            }
        });
    }
    return 'No Fields to render.'
}

export const formatTime = (seconds) => {
    let mill = seconds * 1000;
    let hoursRemaining = (Math.floor(mill / 1000 / 60 / 60)) % 24;
    let minutesRemaining = (Math.floor(mill / 1000 / 60)) % 60;
    let secondsRemaining = (Math.floor(mill / 1000)) % 60;
    let timeAr = []
    if (hoursRemaining > 0) {
        timeAr.push(`${hoursRemaining} hours`);
    }
    if (minutesRemaining > 0) {
        timeAr.push(`${minutesRemaining} minutes`);
    }
    if (secondsRemaining > 0) {
        timeAr.push(`${secondsRemaining} seconds`);
    }
    return timeAr.length ? timeAr.join(', ') + ' remaining' : '';
}

export const formatBytes = (a, b = 2) => {
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}
