import React from 'react';
import validate from "../validators/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import axios from "axios";
import {HOST} from "../../hosts";



class TariffForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleClose=this.props.handleClose;
        this.state = {
            formIsValid: false,
            isUpdate: this.props.isUpdate,
            locationID: this.props.locationId,
            formControls: {
                dayTariff: {
                    value: '',
                    placeholder: "day tariff",
                    valid: false,
                    touched: false,
                    validationRules: {
                        digitValidator: true,
                        isRequired: true
                    }
                },
                nightTariff: {
                    value: '',
                    placeholder: "night tariff",
                    valid: false,
                    touched: false,
                    validationRules: {
                        digitValidator: true,
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            const body = {
                "dayTariff": this.state.formControls.dayTariff.value,
                "nightTariff": this.state.formControls.nightTariff.value
            };
            axios.post(HOST.backend_api + '/tariff/registerTariff', body, {
                headers: {
                    "Authorization": `${localStorage.getItem('jwt')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                console.log(res.data);
                this.handleClose();

            }).catch(err => console.log(err))
    }
    render() {
        return (
            <div>

                <FormGroup id='Tariff'>
                    <Label for='dayTariffField'> Day tariff: </Label>
                    <Input name='dayTariff' id='dayTariffField' placeholder={this.state.formControls.dayTariff.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.dayTariff.value}
                           touched={this.state.formControls.dayTariff.touched? 1 : 0}
                           valid={this.state.formControls.dayTariff.valid}
                           required
                    />
                    {this.state.formControls.dayTariff.touched && !this.state.formControls.dayTariff.valid &&
                    <div className={"error-message row"}> * value must be digits </div>}

                    <Label for='nightTariffField'> Night tariff: </Label>
                    <Input name='nightTariff' id='nightTariffField' placeholder={this.state.formControls.nightTariff.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.nightTariff.value}
                           touched={this.state.formControls.nightTariff.touched? 1 : 0}
                           valid={this.state.formControls.nightTariff.valid}
                           required
                    />
                    {this.state.formControls.nightTariff.touched && !this.state.formControls.nightTariff.valid &&
                    <div className={"error-message row"}> * value must be digits </div>}
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

export default TariffForm;
