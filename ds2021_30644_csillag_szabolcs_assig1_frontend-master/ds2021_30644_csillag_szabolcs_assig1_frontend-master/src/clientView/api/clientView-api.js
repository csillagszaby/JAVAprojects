import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    client: '/client'
};

function getClientById(id, callback){
    let request = new Request(HOST.backend_api + endpoint.client+"/" + id, {
       method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function getDevicesForAClient(clientId,callback) {
    let request = new Request(HOST.backend_api + "/device/oneclient/"+clientId, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function getSensorsForAClient(clientId,callback) {
    let request = new Request(HOST.backend_api + "/sensor/oneclient/"+ clientId, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function getEnergysForAClient(clientId,callback) {
    let request = new Request(HOST.backend_api + "/energy/oneclient/"+clientId, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
export {
    getClientById,
    getDevicesForAClient,
    getSensorsForAClient,
    getEnergysForAClient
};
