import React from 'react';
import validate from "../validators/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import axios from "axios";
import {HOST} from "../../hosts";



class CourtForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleClose= this.props.handleClose;
        this.reloadHandler = this.props.reloadHandler;
        this.locations=this.props.locations;

        this.state = {
            formIsValid: false,
            courtID: this.props.courtId,
            isUpdate: this.props.isUpdate,
            formControls: {
                courtNumber: {
                    value: '',
                    placeholder: "court number",
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        digitValidator: true
                    }
                },
                locationId: {
                    value: '',
                    placeholder: "location",
                    valid: false,
                    touched: false,
                    validationRules: {
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
            locationId:event.target.value,
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    handleSubmit() {
        if(this.state.isUpdate===false) {
            const body = {
                "locationId": this.state.formControls.locationId.value,
                "number": this.state.formControls.courtNumber.value,
            };
            axios.post(HOST.backend_api + '/court/addCourt', body, {
                headers: {
                    "Authorization": `${localStorage.getItem('jwt')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                console.log(res.data);
                this.reloadHandler();
                this.handleClose();
            }).catch(err => console.log(err))
        }else {
                const body = {
                    "id": this.state.courtID,
                    "locationId": this.state.formControls.locationId.value,
                    "number": this.state.formControls.courtNumber.value,
                };

                axios.put(HOST.backend_api + '/court/updateCourt', body, {
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

                <FormGroup id='courtNumber'>
                    <div className="form-group">
                        <Label style={{fontWeight: "bold"}}> Court number: </Label>
                        <Input name="courtNumber" id="courtNumberField" placeholder="Enter court number"
                               onChange={this.handleChange}
                               defaultValue={this.state.formControls.courtNumber.value}
                               touched={this.state.formControls.courtNumber.touched? 1:0}
                               valid={this.state.formControls.courtNumber.valid}
                               required
                        />
                        {this.state.formControls.courtNumber.touched && !this.state.formControls.courtNumber.valid &&
                            <div className={"error-message row"}> Must be a digit </div>}
                    </div>

                    <div className="form-group">
                        <br/>
                        <Label style={{fontWeight: "bold"}}>Location&nbsp;</Label>
                        <select name='locationId' id='locationIdField' placeholder={this.state.formControls.locationId.placeholder}
                                onChange={this.handleChange}
                                value={this.state.locationId}> {
                                    this.locations.map(x => {
                                        return (
                                            <option key={x.id} value={x.id}> {x.details}</option>
                                        )
                                    })
                                }
                        </select>

                    </div>


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

export default CourtForm;