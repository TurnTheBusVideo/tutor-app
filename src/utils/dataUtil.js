import AWS_CONFIG from "../config/awsConfig";
import sessionManager from "./sessionManager";

export const request = async ({fetchUrlObj, method = 'GET', body, tableName = ''}) => {
    return new Promise((resolve, reject) => {
        const authToken = sessionManager.getAuthToken();
        const userName = sessionManager.getUsername();
        if (!authToken) {
            console.error('No auth token');
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
