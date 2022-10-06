import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    device: '/device'
};

function getDevices(callback) {
    let request = new Request(HOST.backend_api + endpoint.device, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.device +"/"+ params.id, {
       method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function putUpdateDevice(device,clientAccountId, callback){
    let request = new Request(HOST.backend_api + endpoint.device+"/"+clientAccountId, {
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function postDevice(device,clientAccountId, callback){
    let request = new Request(HOST.backend_api + endpoint.device +"/"+clientAccountId, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}
function deleteDevice(id,callback){
    let request = new Request(HOST.backend_api + endpoint.device +"/"+id, {
        method: 'Delete',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    putUpdateDevice
};
