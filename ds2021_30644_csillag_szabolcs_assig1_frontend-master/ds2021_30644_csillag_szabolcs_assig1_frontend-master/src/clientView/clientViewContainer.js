import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Card,
    CardHeader,
    Col,
    Row
} from 'reactstrap';


import * as API_CLIENT from "./api/clientView-api";
import { withRouter } from 'react-router';
import {BrowserRouter as Redirect} from 'react-router-dom'
import DeviceTableForAClient from "./components/devicetableforaclient";
import SensorTableForAClient from "./components/sensortableforaclient";
import EnergyTableForAClient from "./components/energytableforaclient";



class ClientViewContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false, 
            clientData: [],
            isLoadedClient: false,
            devicesData: [],
            isLoadedDevices: false,
            sensorsData: [],
            isLoadedSensors: false,
            energysData: [],
            isLoadedEnergys: false,
            errorStatus: 0,
            error: null
        };
    }
    componentDidMount() {
        this.fetchClient();
        this.fetchDevices();
        this.fetchSensors();
        this.fetchEnergys();
    }

    fetchClient() {
        let idClient=sessionStorage.getItem('id');
        return API_CLIENT.getClientById(idClient,(result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    clientData: result,
                    isLoadedClient: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    fetchDevices() {
        let idClient=sessionStorage.getItem('id');
        return API_CLIENT.getDevicesForAClient(idClient, (result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    devicesData: result,
                    isLoadedDevices: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
                
            }
        });
    }
    fetchSensors() {
        let idClient=sessionStorage.getItem('id');
        return API_CLIENT.getSensorsForAClient(idClient, (result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    sensorsData: result,
                    isLoadedSensors: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
                
            }
        });
    }
    fetchEnergys() {
        let idClient=sessionStorage.getItem('id');
        return API_CLIENT.getEnergysForAClient(idClient, (result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    energysData: result,
                    isLoadedEnergys: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
                
            }
        });
    }
    logout() {
        this.setState({selected: !this.state.selected});
        sessionStorage.setItem('loggedIn',"no");
        sessionStorage.setItem('type',"client");
        <Redirect to='/'/>
    }

    render() {
        let type = sessionStorage.getItem('type');
        const { selectedDay } = this.state;
        return (
            <div>
                <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.logout}>Log out </Button>
                        </Col>
                    </Row>
                {() => type==="admin"?<Redirect to='/client'/>:<div/>}
                <CardHeader>
                    <strong> Client View </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <h3>
                    <ul>
                        <li>Id: {this.state.clientData.id}</li>
                        <li>Name: {this.state.clientData.name}</li>
                        <li>Address: {this.state.clientData.address}</li>
                        <li>BirthDate: {this.state.clientData.birthdate}</li>
                        <li>IsAdmin: {this.state.clientData.isAdmin}</li>
                        <li>Password: {this.state.clientData.password}</li>
                    </ul> 
                    </h3>
                    
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoadedDevices && <DeviceTableForAClient tableData = {this.state.devicesData} />}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoadedSensors && <SensorTableForAClient tableData = {this.state.sensorsData} />}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoadedEnergys && <EnergyTableForAClient tableData = {this.state.energysData} />}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                </Card>

                

            </div>
        )

    }
}


export default withRouter(ClientViewContainer);
