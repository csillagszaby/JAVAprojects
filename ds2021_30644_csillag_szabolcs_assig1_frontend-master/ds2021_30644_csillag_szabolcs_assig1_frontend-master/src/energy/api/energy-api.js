import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    energy: '/energy'
};

function getEnergys(callback) {
    let request = new Request(HOST.backend_api + endpoint.energy, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getEnergyById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.energy+"/" + params.id, {
       method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postEnergy(energy,sensorId, callback){
    let request = new Request(HOST.backend_api + endpoint.energy+"/"+sensorId, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(energy)
    });

    //console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}
function putUpdateEnergy(energy,sensorId, callback){
    let request = new Request(HOST.backend_api + endpoint.energy+"/"+sensorId, {
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(energy)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}
function deleteEnergy(id,callback){
    let request = new Request(HOST.backend_api + endpoint.energy +"/"+id, {
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
    getEnergys,
    getEnergyById,
    postEnergy,
    putUpdateEnergy,
    deleteEnergy
};
