import React from "react";
import "../styles.css"
import {FormGroup, Input, Label} from "reactstrap";
import {HOST} from "../hosts";
import axios from "axios";
import validate from "./validators/validator";
export default class GenerateCodeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsValid:false,
            formControls: {
                email: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true,
                        emailValidator: true

                    }
                }
            }
        };
        this.handleGenerateCode=this.handleGenerateCode.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    handleGenerateCode(){
        const body = {
            "email": this.state.formControls.email.value,
        };
        axios.post(HOST.backend_api+'/person/generateCode',body,{
            headers:{"Acces-Control-Allow-Origin":"*"}
        }).then((res)=>{
            //console.log(res.headers.authorization)
            if(res.data==="emailNotFound") {
                alert("Email not found");
            }
            else {
                localStorage.setItem('jwt',`${res.headers.authorization}`);
                sessionStorage.setItem('email',this.state.formControls.email.value);
                window.location.href="/resetPassword";
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
                    <h3>Generate Code For Password Reset </h3>
                    <div>
                        <button type="button" className="btn btn-primary btn-block"
                                onClick={()=>{
                                    window.location.href="/login";
                                }
                                }>Back to login </button>
                    </div>
                    <div className="form-group">
                        <Label style={{fontWeight: "bold"}}>A code with 4 digits will be generated and sent to your email .</Label>
                    </div>
                    <div className="form-group">
                        <Label style={{fontWeight: "bold"}}>Email address</Label>
                        <Input name="email" id="emailField" placeholder="Enter email"
                               onChange={this.handleChange}
                               defaultValue={this.state.formControls.email.value}
                               touched={this.state.formControls.email.touched? 1:0}
                               valid={this.state.formControls.email.valid}
                               required
                        />
                        {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                            <div className={"error-message row"}> * Email must have be [xxx@domain] format </div>}
                    </div>
                    <div align='center'>
                        <button disabled={!this.state.formIsValid}  type="button" className="btn btn-primary btn-block"
                                onClick={()=>{
                                    this.handleGenerateCode();
                                }
                                }>Generate Code </button>
                    </div>
                </FormGroup>
            </div>
        );
    }
}