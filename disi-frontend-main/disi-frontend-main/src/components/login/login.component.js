import React from "react";
import "../../styles.css"
import validate from "../validators/validator";
import {FormGroup, Input, Label} from 'reactstrap'
import axios from "axios";
import {HOST} from "../../hosts";
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
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
                },
                password: {
                    value: '',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                remember:{
                    value: false
                }
            }
        };
        this.handleSubmitButton=this.handleSubmitButton.bind(this);
        this.handleChangeRememberBox=this.handleChangeRememberBox.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    handleChangeRememberBox = event =>
    {
        this.setState({formControls:{remember:{value: event.target.checked}}});
    }

    handleSubmitButton(){
        const body = {
            "email": this.state.formControls.email.value,
            "password": this.state.formControls.password.value,
        };
        axios.post(HOST.backend_api+'/person/login',body,{
            headers:{"Access-Control-Allow-Origin":"*"}
        }).then((res)=>{
            //console.log(res.headers.authorization)
            localStorage.setItem('jwt',`${res.headers.authorization}`);
            sessionStorage.setItem("name",res.data.name);
            sessionStorage.setItem("clientId",res.data.id);
            sessionStorage.setItem("loggedIn","true");
            sessionStorage.setItem("isAdmin",res.data.isAdmin);
            this.setState({
                redirect: true
            });



        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
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
        if(this.state.redirect)
        {
            //return <Navigate to={'/client'} />
            window.location.href='/client';
        }
        return (


                <FormGroup  style={{background: "#ffffff", padding: "5px 20px 5px 20px", borderRadius: "30px",width:'30%', maxWidth:'1000px',top:'20%', left:'35%', position: 'absolute'}}>
                <h3>Sign In</h3>
                <div className="form-group" >
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
                <div className="form-group">
                    <label style={{fontWeight: "bold"}}>Password</label>
                    <Input type="password" name="password" id="passwordField" placeholder="Enter password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1:0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                    <div className={"error-message row"}> * Password length must be greater than 3 </div>}
                </div>
                    <div align='center'>
                <button type="button" className="login-button m-2"
                        onClick={()=>{
                                    this.handleSubmitButton();

                                    }
                }>Submit</button>
                </div>
                <p className="forgot-password text-right">
                    <a href="http://localhost:3000/generateCode">Forgot  password?</a>
                </p>
                </FormGroup>


        );
    }
}

export default Login