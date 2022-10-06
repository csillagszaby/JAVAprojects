import React from 'react';
import DatePicker from 'react-datepicker';
import addDays from 'date-fns/addDays'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import validate from "./validators/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import axios from "axios";
import {HOST} from "../hosts";
import { format } from 'date-fns';

class ReservationForm extends React.Component {
    constructor (props) {
        super(props);
        this.handleClose=this.props.handleClose;

        this.state = {
            formIsValid: false,
            locations:[],
            courts:[],
            startDate: new Date(),
            endDate: new Date(),
            formControls: {
                location: {
                    details: null
                },
                court: {
                    id: null,
                    number: null
                }
            }
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    renderCourts = (court) =>
    {
        return(
            <div key={court.id} className="dropdown-item" style={{marginTop: 10}} onClick={()=>{
                this.setState({
                    formControls: {
                        location:{
                            details:this.state.formControls.location.details
                        },
                        court:{
                            id: court.id,
                            number: court.number
                        }

                    }
                });
            }}>{court.number}</div>

        )
    }
    handleChangeStartDate(date) {
        this.setState({
            startDate: date
        })
        console.log(this.state.startDate.toISOString())
    }
    handleChangeEndDate(date) {
        this.setState({
            endDate: date
        })
    }
    handleSubmit() {
        //console.log(sessionStorage.getItem("clientId"));
        //console.log(this.state.formControls.court.id);
        //console.log(this.state.startDate.toISOString());
        //console.log(this.state.endDate.toISOString());
        const body = {
            "createdById": sessionStorage.getItem("clientId"),
            "courtId": this.state.formControls.court.id,
            "startTime": this.state.startDate,
            "endTime": this.state.endDate,
        };
        console.log(body.startDate);
        axios.post(HOST.backend_api + '/reservation/addReservation', body, {
            headers: {
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res) => {
            console.log(res.data);
        }).catch(err => console.log(err))
    }

    fetchLocations(){
        axios.get(HOST.backend_api+'/location/getAllLocations',{
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            //console.log(res.data);
            this.setState({
                locations : res.data
            });
        }).catch(err=>console.log(err))
    }

    fetchCourts(locationID){
        axios.get(HOST.backend_api+'/court/getCourtsForLocation/'+locationID,{
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            this.setState({
                courts: res.data.body
            });
        }).catch(err=>console.log(err))
    }
    componentDidMount() {
        this.fetchLocations();
    }

    renderLocations = (loc) =>
    {
        return(
            <div key={loc.id} className="dropdown-item" style={{marginTop: 10}} onClick={()=>{
                this.setState({
                    formControls: {
                        location:{
                            details: loc.details
                        },
                        court:{
                            id: null,
                            number: null
                        }

                    }
                });
                this.fetchCourts(loc.id);
            }}>{loc.details}</div>

        )
    }
    render() {
        return (
            <div>
                <form>
                    <div className="dropdown">
                        <Row>
                            <Col>
                                <div style={{color:"black"}}> Location: </div>
                            </Col>
                            <Col>
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{marginTop: 10}}>
                                    Location
                                </button>
                                <div className="dropdown-menu overflow-scroll" aria-labelledby="dropdownMenuButton">
                                    {this.state.locations.map(this.renderLocations)}
                                </div>
                            </Col>
                            <Col>
                                <div style={{marginTop: 10,color:"black"}}>Selected option:  <strong>{this.state.formControls.location.details }</strong> </div>
                            </Col>
                        </Row>
                    </div>
                    {this.state.formControls.location.details!==null ?
                        (<div className="dropdown" style={{marginTop: 10}}>
                            <Row>
                                <Col>
                                    <div style={{marginTop: 10}}> Court: </div>
                                </Col>
                                <Col>
                                    <button className="btn btn-secondary dropdown-toggle" type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Courts
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {this.state.courts.map(this.renderCourts)}
                                    </div>
                                </Col>
                                <Col>
                                    <div style={{marginTop: 10,color:"black"}}>Selected option:  <strong>{this.state.formControls.court.number }</strong></div>
                                </Col>
                            </Row>
                        </div>)
                        :
                        null}
                    <div className="form-group">
                        <Label style={{fontWeight: "bold",color:"white"}}>Start Date: </Label>
                        <DatePicker
                            selected={ this.state.startDate }
                            onChange={ this.handleChangeStartDate }
                            showTimeSelect
                            timeFormat="HH"
                            timeIntervals={60}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy H"
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 100)}
                        />
                    </div>
                    <div className="form-group">
                        <Label style={{fontWeight: "bold",color:"white"}}>End Date: </Label>
                        <DatePicker
                            selected={ this.state.endDate }
                            onChange={ this.handleChangeEndDate }
                            showTimeSelect
                            timeFormat="HH"
                            timeIntervals={60}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy H"
                            minDate={this.state.startDate}
                            maxDate={addDays(new Date(), 100)}
                        />
                    </div>
                </form>
                <Row>
                    <Col>
                        <Button type={"submit"}  onClick={this.handleClose}>  Close </Button>
                    </Col>
                    <Col style={{textAlign: "right"}}>
                        <Button type={"submit"}  onClick={this.handleSubmit}>  Add Reservation </Button>
                    </Col>
                </Row>
            </div>
        );
    }

}
export default ReservationForm;