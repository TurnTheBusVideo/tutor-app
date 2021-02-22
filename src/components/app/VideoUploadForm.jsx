import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, ButtonGroup, ButtonToolbar, Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { getResponse } from '../../utils/dataUtil';
import { formatBytes, formatTime, FormikSelect, renderFields, toUniqueArray } from '../../utils/formUtil';
import { SpinnerButton } from '../shared/SpinnerButton';

const uploadFormSchema = Yup.object().shape({
    tutorName: Yup.string()
      .required('Please provide a tutor name.'),
    chapterName: Yup.string()
      .required('Please provide a chapter name.'),
    chapterNumber: Yup.string()
      .required('Please provide a chapter number.'),
    chapterPart: Yup.string()
        .required('Please provide a chapter part.'),
    title: Yup.string()
      .required('Please provide a video title.'),
    file: Yup.mixed()
        .required('Please provide an mp4 file.')
  });

const VideoUploadForm = ({formData}) => {
    const {bookData, videoData} = formData;
    const [displayedBooks, setDisplayedBooks] = useState(bookData?.Items);
    const [selectedSubject, setSelectedSubject] = useState('English');
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [validated, setValidated] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const [error, setError] = useState();
    const [warning, setWarning] = useState();
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [ultimateFormData, setUltimateFormData] = useState();
    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [uploadXhr, setUploadXhr] = useState(false);
    const [timeStarted, setTimeStarted] = useState(false);
    const formRef = useRef();

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

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        setDisplayedBooks(getSubjectORLanguageFilteredBooks(selectedSubject, selectedLanguage));
    }, [selectedSubject, selectedLanguage]);
    /* eslint-enable react-hooks/exhaustive-deps */



    const displayedLanguages = toUniqueArray(getSubjectFilteredBooks(selectedSubject), 'LANGUAGE');

    const bookNames = toUniqueArray(displayedBooks, 'BOOK_NAME');

    const initFormValues = {
        tutorName: '',
        subject: selectedSubject,
        bookLanguage: displayedLanguages[0],
        bookName: bookNames[0]
    };

    const formReset = () => {
        if (formRef && formRef.current) {
            formRef.current.reset();
        }
    }

    const updateVideoMetaData = (formValues) => {
        if (formValues) {
            // const dataValues = {};
            // formData.forEach(function(value, key){
            //     dataValues[key] = value;
            // });
            // console.debug('dataValues', dataValues);
            getResponse({
                pre: () => {},
                resource: 'updatevideometadata',
                dataValues: formValues,
                validator: () => true,
                victory: () => {
                    setShowUploadProgress(false);
                    setShowSuccessMsg(true);
                    setValidated(false);
                    formReset();
                },
                defeat: (response) => {
                    setError('POST: Could not update video data. Please check console/network logs.');
                },
            })
        } else {
            setError('Sever Error: Unknown uploaded filename. Please check console/network logs.')
        }
    }

    const cancelUploadHandler = event => {
        if (uploadXhr) {
            uploadXhr.abort();
            setWarning('Upload canceled!');
        }
        setShowUploadProgress(false);
    }

    const getNewProgress = () => {
        let timeElapsed = (new Date()) - timeStarted;
        let uploadSpeed = uploadedBytes / (timeElapsed / 1000);
        const newEstimatedTime = (totalBytes - uploadedBytes) / uploadSpeed;

        return {
            eta: formatTime(newEstimatedTime),
            uploadSpeed: Math.round(uploadSpeed / 1000),
        };
    };

    const sendFile = (formData, formValues, signedURL) => {
    if (signedURL && formData.get('file') && formData.get('file').name) {
        setShowUploadProgress(true);
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded * 100) / e.total);
                setTotalBytes(e.total);
                setUploadedBytes(e.loaded);
                setProgress(percentage);
            }
        }, false);

        xhr.open('POST', signedURL.url);
        xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && (xhr.status === 200 || xhr.status === 204)) {
                updateVideoMetaData(formValues);
            }
            else if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) {
                console.error('POST: Server response error. Please check console/network logs.')
            }
        };
        xhr.send(formData);
        setUploadXhr(xhr);
        setTimeStarted(new Date());
    } else {
        !signedURL && setError('Server Error!');
    }
}

const {
    eta,
    uploadSpeed,
} = getNewProgress();

    return (
    <div>
        <Modal
            show={showUploadProgress}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Uploading ({uploadSpeed} KB/s)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <span id="uploadDataDone"></span>
                        <span id="uploadDataTotal">
                            {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
                        </span>
                        <br />
                        <small>
                            {eta} 
                        </small>
                        <div id="uploadProgressBarCtr" class="progress">
                            <span id="uploadProgressValue">{`${progress}%`}</span>
                            <div
                                id="uploadProgressBar"
                                class="progress-bar"
                                style={{
                                    width: `${progress}%`,
                                }}
                                role="progressbar"
                                aria-valuenow={progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >&nbsp;</div>
                        </div>
                    <small>{ultimateFormData?.key || 'No File'}</small>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={cancelUploadHandler}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        <h1>Video Upload</h1><br />
        <p>Fields marked with a red asterisk (<span className="red">*</span>) are required fields. Please provide a valid value for these.</p>
        <p>तारांकन चिह्न (<span className="red">*</span>) के साथ चिह्नित प्रश्न अनिवार्य हैं।</p>
        <Formik
            initialValues={initFormValues}
            onSubmit={(values, { setSubmitting }) => {
                setSubmittingForm(true);
                uploadFormSchema
                    .isValid(values)
                    .then(
                        (isValid) => {
                            if(isValid){
                                const uploadFileField = document.querySelector('#file');
                                const uploadFile = uploadFileField && uploadFileField.files && uploadFileField.files[0];
                                const key = uploadFile && uploadFile.name;
                                if(key){
                                    const {
                                        file,
                                        ...formValues
                                    } = values;
                                    const dataValues = {
                                        key,
                                        ...formValues
                                    }
                                    setUltimateFormData(dataValues);
                                    getResponse({
                                        dataValues,
                                        validator: () => true,
                                        victory: (data) => {
                                            let signedURL = data.signedURL;
                                            let formData = new FormData();
                                            // console.debug('signedURL.fields', signedURL.fields);
                                            Object.keys(signedURL.fields).forEach(key => {
                                                formData.append(key, signedURL.fields[key]);
                                            });
                                            formData.append('file', uploadFile);
                                            setSubmittingForm(false);
                                            sendFile(formData, dataValues, signedURL);
                                        },
                                        defeat: (error) => {
                                            console.error(error);
                                            setError('Failed to upload!');
                                        },
                                    })
                                } else {
                                    setError('No file!');
                                }
                            }
                        },
                        (reason) => {
                            console.error(reason);
                            setError('Failed to upload!');
                        },
                    );
                setSubmitting(false);
            }}
            validationSchema={uploadFormSchema}
        >
            {({
                errors,
                handleChange,
                handleReset,
                handleSubmit,
                touched,
                values,
             }) => {
                 const {
                    chapterPart = '',
                    chapterNumber = '',
                    title = '',
                    chapterName = '',
                    bookName = '',
                    class: classVal = ''
                 } = values || {};
                 return (
                    <Form
                        validated={validated}
                        noValidate
                        ref={formRef}
                    >
                        <h2>Tutor Information</h2>
                        {
                            renderFields({
                                errors,
                                fields: tutorInfoFields,
                                handleChange,
                                touched,
                                values,
                            })
                        }
                        <h2>Class Information</h2>
                        <Form.Row>
                        {
                            renderFields({
                                errors,
                                fields: classInfoFields,
                                handleChange,
                                horizontal: true,
                                touched,
                                values,
                            })
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
                            renderFields({
                                errors,
                                fields: bookInfoFields,
                                handleChange,
                                values,
                            })
                        }
                        <h2>Video Details</h2>
                        {
                            <Form.Group controlId="titlePreview">
                                <Form.Label>Final Title Preview</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={values
                                        ? (
                                            chapterPart + ' CH ' + chapterNumber + ' ' + 
                                            title + ' ' + chapterName + ' ' + bookName + ' ' + classVal
                                        ) : ''}
                                    readOnly
                                />
                                <Form.Text className="text-muted">
                                    This will be the final video title on YouTube and EdX.
                                    It is a combination of form fields on this page.
                                    A catchy title can help you hook
                                    viewers. When you create video
                                    titles, it’s a good idea to include keywords your audience is likely to use when looking for
                                    videos like yours.
                                    <a target="_blank" rel="noopener noreferrer" href="https://creatoracademy.youtube.com/page/lesson/titles">Learn more</a>
                                </Form.Text>
                            </Form.Group>
                        }
                        {
                            renderFields({
                                errors,
                                fields: videoInfoFields,
                                handleChange,
                                values,
                            })
                        }
                        <ButtonToolbar aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                                <SpinnerButton
                                    type="button"
                                    onClick={(event) => {
                                        setValidated(true);
                                        handleSubmit(event);
                                    }}
                                    spinning={submittingForm}
                                    label='Upload' />
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={(event) => {
                                        setValidated(false);
                                        formReset();
                                        setShowSuccessMsg(false);
                                        handleReset(event);
                                    }}>
                                        clear all
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                            {showSuccessMsg &&
                                <Alert variant="success">
                                    File uploaded successfully!
                                </Alert>
                            }
                            {warning &&
                                <Alert variant="warning">
                                    {warning}
                                </Alert>
                            }
                            {error &&
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            }
                    </Form>
                );
             }}
        </Formik>
    </div>
)};

export default VideoUploadForm;
