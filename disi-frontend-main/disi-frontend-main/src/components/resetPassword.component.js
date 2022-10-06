import React from "react";
import "../styles.css"
import {FormGroup, Input, Label} from "reactstrap";
import {HOST} from "../hosts";
import axios from "axios";
import validate from "./validators/validator";
export default class ResetPasswordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsValid:false,
            formControls: {
                password: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                code: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                }
            }
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleResetPassword=this.handleResetPassword.bind(this);
    }

    handleResetPassword(){
        const body = {
            "email": window.sessionStorage.getItem('email'),
            "password": this.state.formControls.password.value,
            "code": this.state.formControls.code.value,
        };
        axios.post(HOST.backend_api+'/person/resetPassword',body,{
            headers:{"Acces-Control-Allow-Origin":"*"}
        }).then((res)=>{
            if(res.data==="You introduced a wrong code") {
                alert("You introduced a wrong code");
            }
            else if(res.data==="Time to reset your password is expired") {
                alert("Time to reset your password is expired");
                window.location.href="/generateCode";
            }
            else {
                //console.log(res.headers.authorization)
                localStorage.setItem('jwt',`${res.headers.authorization}`);
                window.location.href="/login";
            }
        })
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

    render() {
        return (
            <div>
            <FormGroup>
                <div>
                    <button type="button" className="btn btn-primary btn-block"
                            onClick={()=>{
                                window.location.href="/generateCode";
                            }
                            }>Back to email  </button>
                </div>
                <h3>Reset password </h3>
                <div className="form-group">
                    <Label style={{fontWeight: "bold"}}>Code Received</Label>
                    <Input name="code" id="codeField" placeholder="Enter code"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.code.value}
                           touched={this.state.formControls.code.touched? 1:0}
                           valid={this.state.formControls.code.valid}
                           required
                    />
                </div>
                <div className="form-group">
                    <Label style={{fontWeight: "bold"}}>New Password</Label>
                    <Input name="password" id="passwordField" placeholder="Enter new password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1:0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                </div>
                <div align='center'>
                    <button disabled={!this.state.formIsValid} type="button" className="btn btn-primary btn-block"
                            onClick={()=>{
                                this.handleResetPassword();
                            }
                            }>Change Password </button>
                </div>
            </FormGroup>
            </div>
        );
    }
}