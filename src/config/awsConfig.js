const AWS_CONFIG = {
    cognito: {
        userPoolId: 'ap-south-1_goMJyvOwY',
        userPoolWebClientId: '6pvgee8erngn4d70buf5ulnefs',
        region: 'ap-south-1'
    },
    api: {
        invokeUrl: 'https://1bb73f90n5.execute-api.ap-south-1.amazonaws.com/test'
    },
    videoBucket: 'test-turnthebus-upload',
};

export default AWS_CONFIG;