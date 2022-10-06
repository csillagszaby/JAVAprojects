import React from 'react';
import validate from "./validators/sensor-validators";
import Button from "react-bootstrap/Button";
import * as API_SENSORS from "../api/sensor-api";
import * as API_DEVICES from "../../device/api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class SensorEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.sensor=this.props.sensor;

        this.state = {
            devices: [],
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                sensorDescription: {
                    value: this.sensor.sensorDescription,
                    placeholder: 'sensor description',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                maximumValue: {
                    value: this.sensor.maximumValue,
                    placeholder: 'maximumValue',
                    valid: true,
                    touched: true
                },
                deviceId: {
                    value: this.sensor.deviceDTO.id,
                    placeholder: 'device',
                    valid: true,
                    touched: true
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
    updateSensor(sensor,deviceId) {
        return API_SENSORS.putUpdateSensor(sensor,deviceId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated sensor with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
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

    handleSubmit() {
        let sensor = {
            id: this.sensor.id,
            sensorDescription: this.state.formControls.sensorDescription.value,
            maximumValue: this.state.formControls.maximumValue.value
        };

        console.log(sensor);
        this.updateSensor(sensor,this.state.formControls.deviceId.value);
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
                           value={this.sensor.deviceDTO.id}>
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

export default SensorEditForm;
