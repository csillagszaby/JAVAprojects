import React from 'react';
import validate from "./validators/sensor-validators";
import Button from "react-bootstrap/Button";
import * as API_SENSORS from "../api/sensor-api";
import * as API_DEVICES from "../../device/api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class SensorForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            devices: [],
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                sensorDescription: {
                    value: '',
                    placeholder: 'sensor description',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                maximumValue: {
                    value: '',
                    placeholder: 'maximumValue',
                    valid: false,
                    touched: false
                },
                deviceId: {
                    value: null,
                    placeholder: 'device',
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
        this.fetchDevices();
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    devices: result,
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
            deviceId: event.target.value,
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    
    };

    registerSensor(sensor,deviceId) {
        return API_SENSORS.postSensor(sensor,deviceId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted sensor with id: " + result);
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
        let sensor = {
            sensorDescription: this.state.formControls.sensorDescription.value,
            maximumValue: this.state.formControls.maximumValue.value
        };

        console.log(sensor);
        this.registerSensor(sensor,this.state.formControls.deviceId.value);
    }

    render() {
        return (
            <div>

                <FormGroup id='sensorDescription'>
                    <Label for='sensorDescriptionField'> SensorDescription: </Label>
                    <Input name='sensorDescription' id='sensorDescriptionField' placeholder={this.state.formControls.sensorDescription.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.sensorDescription.value}
                           touched={this.state.formControls.sensorDescription.touched? 1 : 0}
                           valid={this.state.formControls.sensorDescription.valid}
                           required
                    />
                    {this.state.formControls.sensorDescription.touched && !this.state.formControls.sensorDescription.valid &&
                    <div className={"error-message row"}> * SensorDescription must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='maximumValue'>
                    <Label for='maximumValueField'> MaximumValue: </Label>
                    <Input name='maximumValue' id='maximumValueField' placeholder={this.state.formControls.maximumValue.placeholder}
                           min={0} max={10000} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.maximumValue.value}
                           touched={this.state.formControls.maximumValue.touched? 1 : 0}
                           valid={this.state.formControls.maximumValue.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='deviceId'>
                    <select name='deviceId' id='deviceIdField' placeholder={this.state.formControls.deviceId.placeholder}
                           onChange={this.handleDropdownChange}
                           defaultValue={this.state.formControls.deviceId.value}>
                        {
                            this.state.devices.map(x => {
                                return (
                                    <option key={x.id} value={x.id}> {x.id}</option>
                                )
                            })
                        }

                    </select>
                </FormGroup>

                    <Row>
                        <Col sm={{size: '4', offset: 8}}>
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

export default SensorForm;
