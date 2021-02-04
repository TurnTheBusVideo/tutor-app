import AWS_CONFIG from "../config/awsConfig";
import sessionManager from "./sessionManager";

const NO_AUTH_MSG = 'No auth token';

export const request = async ({fetchUrlObj, method = 'GET', body, tableName = ''}) => {
    return new Promise((resolve, reject) => {
        const authToken = sessionManager.getAuthToken();
        const userName = sessionManager.getUsername();
        if (!authToken) {
            console.error(NO_AUTH_MSG);
            reject({});
        }

        if (!fetchUrlObj) {
            console.error('No or invalid url');
            reject({});
        }
        try {
            const params = {
                'Content-Type': 'application/json',
                crossdomain: true,
                dataType: 'json',
                headers: new Headers({
                    'Authorization': authToken
                }),
        };
            if (method !== 'GET') {
                params.method = 'POST';
                params.body = JSON.stringify(body)
            } else {
                tableName && fetchUrlObj.searchParams.append('tableName', tableName);
            }
            resolve(fetch(fetchUrlObj, params).then(response => response.json()));
        }
        catch (e) {
            console.error('error fetching response', e);
            reject({});
        }
    });
}

export const setCouldData = ({
    pre,
    name,
    query,
    validator,
    victory,
    defeat,
    body
}) => {
    pre();
    const setDataUrl = new URL("https://indmrclke8.execute-api.us-west-2.amazonaws.com/dev/add");
    setDataUrl.searchParams.append('objectName', name);
    if (query) {
        Object.keys(query).forEach(queryKey => {
            setDataUrl.searchParams.append(queryKey, query[queryKey]);
        })
    }
    request({
        fetchUrlObj: setDataUrl,
        method: 'POST',
        body
    }).then((response) => {
        if (validator(response)) {
            victory(response?.data)
        } else {
            defeat()
        }
    }, (reason) => {
        defeat(reason)
    });
}

export const getCloudData = ({
    pre = () => {},
    tableName,
    query,
    validator,
    victory,
    defeat
}) => {
    pre();
    const getDataUrlObj = new URL(`${AWS_CONFIG.api.invokeUrl}/scantable`);
    if (query) {
        Object.keys(query).forEach(queryKey => {
            getDataUrlObj.searchParams.append(queryKey, query[queryKey]);
        })
    }
    request({
        fetchUrlObj: getDataUrlObj,
        tableName
    }).then((response) => {
        if (validator(response)) {
            victory(response?.result)
        } else {
            defeat()
        }
    }, (reason) => {
        defeat(reason)
    });
}

export const getResponse = ({
    pre = () => {},
    resource = 'getsignedurl',
    dataValues,
    validator,
    victory,
    defeat,
}) => {
    try{
        pre();
        const authToken = sessionManager.getAuthToken();
        if (!authToken) {
            console.error(NO_AUTH_MSG);
            defeat(NO_AUTH_MSG);
        }
        const url = new URL(`${AWS_CONFIG.api.invokeUrl}/${resource}`);
        url.searchParams.append('bucket', AWS_CONFIG.videoBucket);
        Object.keys(dataValues).forEach((objectKey) => {
            url.searchParams.append(objectKey, dataValues[objectKey]);
        });
        fetch(
            url,
            {
                crossdomain: true,
                contentType: 'application/json',
                dataType: 'json',
                headers: new Headers({
                    'Authorization': authToken
                }),
            }
        )
        .then(response => response.json())
        .then(
            (response) => {
                if(validator(response)){
                    victory(response);
                } else {
                    defeat(response);
                }
            }
        )
    } catch (e) {
        console.error('Error getting video upload URL!');
        defeat(e);
    }
}
