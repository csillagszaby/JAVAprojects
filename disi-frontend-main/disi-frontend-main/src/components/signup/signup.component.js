import React, { Component } from "react";
import {FormGroup, Input} from 'reactstrap'
import validate from "../validators/validator";
import axios from "axios";
import {HOST} from "../../hosts";
export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormValid: false,
            formControls: {
                name: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true,

                    }
                },
                email: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true,
                        emailValidator: true

                    }
                },
                password: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true,

                    }
                },
                confirmPassword: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                    }
                },
                phone: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 10,
                        isRequired: true,
                        digitValidator: true

                    }
                }
            }
        };
        this.handleSubmitButton=this.handleSubmitButton.bind(this);
        this.handleChange=this.handleChange.bind(this);
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

    handleSubmitButton(){

        const body = {
            "name": this.state.formControls.name.value,
            "email": this.state.formControls.email.value,
            "password": this.state.formControls.password.value,
            "phone": this.state.formControls.phone.value
        };
        axios.post(HOST.backend_api+'/person/register',body,{
            headers:{"Access-Control-Allow-Origin":"*"}
        }).then((res)=>{
            if(res.data==="User created")
            {
                alert("User created successfully");
                window.location.href='/login';
            }
            else
                alert("Something went wrong, try again");
        }).catch(err=>console.log(err))

    }
    render() {
        return (
            <FormGroup style={{background: "#ffffff", padding: "5px 20px 5px 20px", borderRadius: "30px",width:'30%', maxWidth:'1000px',top:'20%', left:'35%', position: 'absolute'}}>
                <h3>Sign Up</h3>
                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Name</label>
                    <Input name="name" id="nameField" placeholder="Enter name"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1:0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message row"}> * Name must contain at least 3 letters </div>}
                </div>

                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Email address</label>
                    <Input name="email" id="emailField" placeholder="Enter email"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.email.value}
                           touched={this.state.formControls.email.touched? 1:0}
                           valid={this.state.formControls.email.valid}
                           required
                    />
                    {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                    <div className={"error-message row"}> * Must be a valid email format </div>}
                </div>
                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Password</label>
                    <Input type="password"  name="password" id="passwordField" placeholder="Enter password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1:0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                    <div className={"error-message row"}> * Password must contain at least 3 letters </div>}
                </div>

                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Confirm Password</label>
                    <Input type="password" name="confirmPassword" id="confirmPasswordField" placeholder="Confirm password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.confirmPassword.value}
                           touched={this.state.formControls.confirmPassword.touched? 1:0}
                           valid={this.state.formControls.confirmPassword.valid}
                           required
                    />
                    {this.state.formControls.password.value===this.state.formControls.confirmPassword.value ? null :
                    <div className={"error-message row"}> * Passwords don't match </div>}

                </div>

                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Phone</label>
                    <Input name="phone" id="phoneNumberField" placeholder="Enter phone number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.phone.value}
                           touched={this.state.formControls.phone.touched? 1:0}
                           valid={this.state.formControls.phone.valid}
                           required
                    />
                    {this.state.formControls.phone.touched && !this.state.formControls.phone.valid &&
                    <div className={"error-message row"}> * Enter a 10 digits phone number </div>}
                </div>
                <div align='center'>
                    <button type="button" className="btn btn-primary btn-block mt-2" onClick={() => {
                        this.handleSubmitButton();

                    }
                    }>Sign Up</button>
                </div>

                <p className="forgot-password text-right">
                    {/*Already registered <a href="#">sign in?</a>*/}
                </p>
            </FormGroup>
        );
    }
}