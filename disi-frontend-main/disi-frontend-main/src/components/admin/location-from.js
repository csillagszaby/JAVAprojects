import React from 'react';
import validate from "../validators/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import axios from "axios";
import {HOST} from "../../hosts";



class LocationForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.handleClose= this.props.handleClose;

        this.state = {
            formIsValid: false,
            isUpdate: this.props.isUpdate,
            locationID: this.props.locationId,
            formControls: {
                details: {
                    value: '',
                    placeholder: "location details",
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
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

    handleSubmit() {
        if(this.state.isUpdate===false) {
            const body = {
                "details": this.state.formControls.details.value
            };
            axios.post(HOST.backend_api + '/location/addLocation', body, {
                headers: {
                    "Authorization": `${localStorage.getItem('jwt')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                console.log(res.data);
                this.reloadHandler();
                this.handleClose();

            }).catch(err => console.log(err))
        }
        else {
            const body = {
                "id": this.state.locationID,
                "details": this.state.formControls.details.value
            };

            axios.put(HOST.backend_api + '/location/updateLocation', body, {
                headers: {
                    "Authorization": `${localStorage.getItem('jwt')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                console.log(res.data);
                this.reloadHandler();
                this.handleClose();

            }).catch(err => console.log(err))
        }

    }
    render() {
        return (
            <div>

                <FormGroup id='details'>
                    <Label for='detailsField'> Location: </Label>
                    <Input name='details' id='detailsField' placeholder={this.state.formControls.details.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.details.value}
                           touched={this.state.formControls.details.touched? 1 : 0}
                           valid={this.state.formControls.details.valid}
                           required
                    />
                    {this.state.formControls.details.touched && !this.state.formControls.details.valid &&
                    <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>

                <Row>
                    <Col>
                        <Button type={"submit"}  onClick={this.handleClose}>  Close </Button>
                    </Col>
                    <Col style={{textAlign: "right"}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>

                </Row>


            </div>

        ) ;
    }
}

export default LocationForm;
