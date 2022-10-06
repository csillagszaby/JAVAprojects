import {HOST} from '../commons/hosts';
import RestApiClient from "../commons/api/rest-client";


const endpoint = {
    account: '/account/'
};


function getClientAccountByName(name, callback) {
    let request = new Request(HOST.backend_api +"/client"+ endpoint.account + name, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getClientAccountByName
};
