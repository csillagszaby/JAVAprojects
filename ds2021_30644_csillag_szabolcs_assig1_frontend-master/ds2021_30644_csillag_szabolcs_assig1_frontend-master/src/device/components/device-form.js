import React from 'react';
import validate from "./validators/sensor-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import * as API_CLIENTS from "../../client/api/clientAccount-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class DeviceForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            clients:[],
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                description: {
                    value: '',
                    placeholder: 'Device description',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Cluj',
                    valid: false,
                    touched: false
                },
                maxEnergyConsumption: {
                    value: '',
                    placeholder: '100',
                    valid: false,
                    touched: false
                },
                averageEnergyConsumption: {
                    value: '',
                    placeholder: '70',
                    valid: false,
                    touched: false
                },
                selectedClient: {
                    value: null,
                    placeholder: "clientName",
                    valid: false,
                    touched: false
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }
    componentDidMount() {
        this.fetchClients();
    }

    fetchClients() {
        return API_CLIENTS.getClients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    clients: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };
handleDropdownChange = event => {

    const name = event.target.name;
    const value = event.target.value;

    const updatedControls = this.state.formControls;

    const updatedFormElement = updatedControls[name];

    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
    updatedControls[name] = updatedFormElement;

    let formIsValid = true;
    for (let updatedFormElementName in updatedControls) {
        formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
    }

    this.setState({
        selectedClient: event.target.value,
        formControls: updatedControls,
        formIsValid: formIsValid
    });

};

    registerDevice(device,clientAccountId) {
        return API_DEVICES.postDevice(device,clientAccountId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        let device = {
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            maxEnergyConsumption: this.state.formControls.maxEnergyConsumption.value,
            averageEnergyConsumption: this.state.formControls.averageEnergyConsumption.value
        };

        console.log(device);
        this.registerDevice(device,this.state.formControls.selectedClient.value);
    }

    render() {
        return (
            <div>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                    <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='maxEnergyConsumption'>
                    <Label for='maxEnergyConsumptionField'> maxEnergyConsumption: </Label>
                    <Input name='maxEnergyConsumption' id='maxEnergyConsumptionField' placeholder={this.state.formControls.maxEnergyConsumption.placeholder}
                           min={0} max={90000} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.maxEnergyConsumption.value}
                           touched={this.state.formControls.maxEnergyConsumption.touched? 1 : 0}
                           valid={this.state.formControls.maxEnergyConsumption.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='averageEnergyConsumption'>
                    <Label for='averageEnergyConsumptionField'> averageEnergyConsumption: </Label>
                    <Input name='averageEnergyConsumption' id='averageEnergyConsumptionField' placeholder={this.state.formControls.averageEnergyConsumption.placeholder}
                           min={0} max={90000} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.averageEnergyConsumption.value}
                           touched={this.state.formControls.averageEnergyConsumption.touched? 1 : 0}
                           valid={this.state.formControls.averageEnergyConsumption.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='selectedClient'>
                    <select name='selectedClient' id='selectedClientField' placeholder={this.state.formControls.selectedClient.placeholder}
                           onChange={this.handleDropdownChange}
                           defaultValue={this.state.formControls.selectedClient.value}>
                        {
                            this.state.clients.map(x => {
                                return (
                                    <option key={x.id} value={x.id}> {x.name}</option>
                                )
                            })
                        }

                    </select>
                </FormGroup>

                    <Row>
                        <Col sm={{size: '5', offset: 10}}>
                            <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                        </Col>
                    </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default DeviceForm;
