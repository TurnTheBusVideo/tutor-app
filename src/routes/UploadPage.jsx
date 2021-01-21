import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container'
import React, { useEffect, useState } from 'react';
import WelcomeBanner from '../components/shared/WelcomeBanner';
import SpinnerText from '../components/shared/SpinnerText';
import { getCloudData } from '../utils/dataUtil';
import { Alert } from 'react-bootstrap';
import VideoUploadForm from '../components/app/VideoUploadForm';
import { Link } from 'react-router-dom';

const UploadPage = () => {
    const [formLoading, setFormLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showFormError, setShowFormError] = useState(false);
    const [videoMetaData, setVideoMetaData] = useState({});
    const [booksMetaData, setBooksMetaData] = useState({});

    useEffect(() => {
        getCloudData({
            pre: () => setFormLoading(true),
            tableName: 'videoMetadata',
            validator: (response) => response?.result?.Count >= 0,
            victory: (videoMetadata, textStatus, jqXHR) => {
                setVideoMetaData(videoMetadata);
                getCloudData({
                    tableName: 'booksMetaData',
                    validator: (response) => response?.result?.Count >= 0,
                    victory: (booksMetaData, textStatus, jqXHR) => {
                        setFormLoading(false);
                        setBooksMetaData(booksMetaData);
                        setShowForm(true);
                    },
                    defeat: () => {
                        setFormLoading(false);
                        setShowFormError(true);
                    }
                });
            },
            defeat: () => {
                setFormLoading(false);
                setShowFormError(true);
            }
        });
    }, []
    );

    return (
        <>
            <WelcomeBanner/>
            {
                <Container className="upload-main-content">
                    <Row>
                        <Col />
                        <Col sm={12} md={8} >
                            <SpinnerText spinning={formLoading} label=" loading video upload form" />
                            {!formLoading && !showFormError && showForm && (
                                <VideoUploadForm formData={{
                                    bookData: booksMetaData,
                                    videoData: videoMetaData
                                }} />
                            )}
                            <Alert
                                closeLabel="dismiss alert"
                                dismissible
                                show={showFormError}
                                onClose={() => setShowFormError(false)}
                                variant='danger'
                            >
                                Encountered some error getting form data. <Link to='/login'>Try signing in again.</Link> 
                            </Alert>
                        </Col>
                        <Col />
                    </Row>
                </Container>
            }
        </>
    );
};

export default UploadPage;
