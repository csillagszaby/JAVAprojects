import React from 'react';
import validate from "./validators/clientAccount-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/clientAccount-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class ClientAccountEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.user=this.props.user;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: this.user.name,
                    placeholder: 'What is your name?...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: this.user.address,
                    placeholder: 'Address...',
                    valid: true,
                    touched: true
                },
                birthDate: {
                    value: this.user.birthdate,
                    placeholder: '30-11-1999',
                    valid: true,
                    touched: true
                },
                isAdmin: {
                    value: this.user.isAdmin,
                    placeholder: 'no',
                    valid: true,
                    touched: true
                },
                password: {
                    value: this.user.password,
                    placeholder: 'password',
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

    updateClient(client) {
        return API_USERS.putUpdateClient(client, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated client with id: " + result);
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
        let client = {
            id: this.user.id,
            name: this.state.formControls.name.value,
            address: this.state.formControls.address.value,
            birthdate: this.state.formControls.birthDate.value,
            isAdmin: this.state.formControls.isAdmin.value,
            password: this.state.formControls.password.value
        };

        console.log(client);
        this.updateClient(client);
    }

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
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
                <FormGroup id='birthDate'>
                    <Label for='birthDateField'> birthDate: </Label>
                    <Input name='birthDate' id='birthDateField' placeholder={this.state.formControls.birthDate.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.birthDate.value}
                           touched={this.state.formControls.birthDate.touched? 1 : 0}
                           valid={this.state.formControls.birthDate.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='isAdmin'>
                    <Label for='isAdminField'> isAdmin: </Label>
                    <Input name='isAdmin' id='isAdminField' placeholder={this.state.formControls.isAdmin.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.isAdmin.value}
                           touched={this.state.formControls.isAdmin.touched? 1 : 0}
                           valid={this.state.formControls.isAdmin.valid}
                           required
                    />
                </FormGroup>
                <FormGroup id='password'>
                    <Label for='passwordField'> password: </Label>
                    <Input name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                          onChange={this.handleChange}
                          defaultValue={this.state.formControls.password.value}
                          touched={this.state.formControls.password.touched? 1 : 0}
                          valid={this.state.formControls.password.valid}
                          required
                    />
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

export default ClientAccountEditForm;
