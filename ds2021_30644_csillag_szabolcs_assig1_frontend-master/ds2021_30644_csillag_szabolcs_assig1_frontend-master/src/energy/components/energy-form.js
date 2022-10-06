import React from 'react';
import validate from "./validators/energy-validators";
import Button from "react-bootstrap/Button";
import * as API_SENSORS from "../../sensor/api/sensor-api";
import * as API_ENERGYS from "../api/energy-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class EnergyForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            sensors: [],
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                value: {
                    value: '',
                    placeholder: "value",
                    valid: false,
                    touched: false
                },
                sensorId: {
                    value: null,
                    placeholder: 'sensor',
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
        this.fetchSensors();
    }

    fetchSensors() {
        return API_SENSORS.getSensors((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    sensors: result,
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
            sensorId: event.target.value,
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    
    };

    registerEnergy(energy,sensorId) {
        return API_ENERGYS.postEnergy(energy,sensorId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted energy with id: " + result);
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
        let energy = {
            value: this.state.formControls.value.value
        };

        console.log(energy);
        this.registerEnergy(energy,this.state.formControls.sensorId.value);
    }

    render() {
        return (
            <div>
                <FormGroup id='value'>
                    <Label for='valueField'> Value: </Label>
                    <Input name='value' id='valueField' placeholder={this.state.formControls.value.placeholder}
                           min={0} max={10000} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.value.value}
                           touched={this.state.formControls.value.touched? 1 : 0}
                           valid={this.state.formControls.value.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='sensorId'>
                    <select name='sensorId' id='sensorIdField' placeholder={this.state.formControls.sensorId.placeholder}
                           onChange={this.handleDropdownChange}
                           defaultValue={this.state.formControls.sensorId.value}>
                        {
                            this.state.sensors.map(x => {
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

export default EnergyForm;
