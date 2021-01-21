import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Col, Form } from 'react-bootstrap';
import { FormikSelect, renderFields, toUniqueArray } from '../../utils/formUtil';

const VideoUploadForm = ({formData}) => {
    const {bookData, videoData} = formData;
    const [displayedBooks, setDisplayedBooks] = useState(bookData?.Items);
    const [selectedSubject, setSelectedSubject] = useState('English');
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const classInfoFields = videoData?.Items?.filter(dataItems => dataItems.section === 'CLASS_INFO') || [];
    const tutorInfoFields = videoData?.Items?.filter(dataItems => dataItems.section === 'TUTOR_INFO').sort((a, b) => a.order - b.order) || [];
    const bookInfoFields = videoData?.Items?.filter(dataItems => dataItems.section === 'BOOK_INFO').sort((a, b) => a.order - b.order) || [];
    const videoInfoFields = videoData?.Items?.filter(dataItems => dataItems.section === 'VIDEO_INFO').sort((a, b) => a.order - b.order) || [];

    const getFiltered = (filterKey, filterValue, items) => {
        if(items && filterValue) {
            return items?.filter((eachItem) => eachItem[filterKey] === filterValue);
        }
        return items || [];
    }

    const getSubjectFilteredBooks = (subject) => {
        return getFiltered('SUBJECT', subject, bookData?.Items);
    }

    const getSubjectLanguageFilteredBooks = (subject, language) => {
        return getFiltered('LANGUAGE', language, getSubjectFilteredBooks(subject));
    }

    const getSubjectORLanguageFilteredBooks = (subject, language) => {
        const filteredBooks = getSubjectLanguageFilteredBooks(subject, language);
        return filteredBooks?.length ? filteredBooks : getSubjectFilteredBooks(subject);
    }

    const firstUnique = (items, key) => toUniqueArray(items, key)[0];

    useEffect(() => {
        setDisplayedBooks(getSubjectORLanguageFilteredBooks(selectedSubject, selectedLanguage));
    }, [selectedSubject, selectedLanguage]);



    const displayedLanguages = toUniqueArray(getSubjectFilteredBooks(selectedSubject), 'LANGUAGE');

    const bookNames = toUniqueArray(displayedBooks, 'BOOK_NAME');

    
    const initFormValues = {
        subject: selectedSubject,
        bookLanguage: displayedLanguages[0],
        bookName: bookNames[0]
    };

    return (
    <div>
        <h1>Video Upload</h1><br />
        <p>Fields marked with a red asterisk (<span className="red">*</span>) are required fields. Please provide a valid value for these.</p>
        <p>तारांकन चिह्न (<span className="red">*</span>) के साथ चिह्नित प्रश्न अनिवार्य हैं।</p>
        {/* {selectedSubject}, {selectedLanguage} */}
        <Formik
            initialValues={initFormValues}
            onSubmit={(values, { setSubmitting }) => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }}
        >
            {({
                handleSubmit,
                handleReset,
                handleChange,
                setFieldValue,
                values,
                touched,
                isValid,
                errors,
             }) => (
                <Form>
                    <h2>Tutor Information</h2>
                    {
                        renderFields(tutorInfoFields, values, handleChange)
                    }
                    <h2>Class Information</h2>
                    <Form.Row>
                    {
                        renderFields(classInfoFields, values, handleChange, true)
                    }
                    </Form.Row>
                    <h2>Book Information</h2>
                    <Form.Row>
                        <FormikSelect
                            horizontal
                            displayName="Subject"
                            required
                            id="subject"
                            name="subject"
                            value={values.subject}
                            onChange={(event) => {
                                const newSubject = event?.target?.value;
                                values.bookLanguage = firstUnique(getSubjectFilteredBooks(newSubject), 'LANGUAGE');
                                values.bookName = firstUnique(getSubjectORLanguageFilteredBooks(newSubject, values.bookLanguage), 'BOOK_NAME');
                                setSelectedSubject(newSubject);
                                setSelectedLanguage(values.bookLanguage);
                                handleChange(event);
                            }}
                            selectFrom={toUniqueArray(bookData?.Items, 'SUBJECT')}
                        />
                        <FormikSelect
                            horizontal
                            displayName="Book Language"
                            required
                            id="bookLanguage"
                            name="bookLanguage"
                            value={values.bookLanguage}
                            onChange={(event) => {
                                values.bookName = firstUnique(getSubjectORLanguageFilteredBooks(values.subject, event?.target?.value), 'BOOK_NAME');
                                setSelectedLanguage(event?.target?.value);
                                handleChange(event);
                            }}
                            selectFrom={displayedLanguages}
                        />
                    </Form.Row>
                    <FormikSelect 
                        displayName="Book Name"
                        required
                        id="bookName"
                        name="bookName"
                        value={values.bookName}
                        onChange={handleChange}
                        selectFrom={bookNames}
                    />
                    {
                        renderFields(bookInfoFields, values, handleChange)
                    }
                    <h2>Video Details</h2>
                    {
                        renderFields(videoInfoFields, values, handleChange)
                    }
                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="mr-2" aria-label="First group">
                            <Button type="button" onClick={handleSubmit}>Upload</Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2" aria-label="Second group">
                            <Button type="button" variant="outline-secondary" onClick={handleReset}>clear all</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                        {/* {values.subject}
                        {` `}
                        {values.bookLanguage}
                        {` `}
                        {values.bookName} */}
                </Form>
            )}
        </Formik>
    </div>
)};

export default VideoUploadForm;