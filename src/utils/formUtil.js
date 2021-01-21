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
    let t = objArr?.forEach(obj => {
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
                    id="custom-file"
                    label="Custom file input"
                    custom
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
    ...controlProps
}) => {
    const formGroupProps = {};
    if(horizontal) {
        formGroupProps['as'] = Col;
    }
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
                <Form.Text muted>
                    {typeof helpText === 'function' ? helpText() : (helpText || '')}
                    {learnMore ? (
                        <>
                            {` `}<a target="_blank" href={learnMore}>Learn more</a>
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

export const renderControl = (fieldData, index, values, handleChange) => {
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

export const renderFile = (fieldData, index, formikValues, handleChange) => {
    const {
        fieldName,
        formFieldId,
        ...other
    } = fieldData;

    return (
        fieldName
        && formFieldId
        ? (<FormikFile
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

export const renderFields = (fields, values, handleChange, horizontal) => {
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
                    }, index, values, handleChange)
                }
                default:
                    return renderControl({
                        horizontal,
                        ...fieldData
                    }, index, values, handleChange)
            }
        });
    }
    return 'No Fields to render.'
}
