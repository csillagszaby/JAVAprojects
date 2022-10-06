import React from 'react';
import Button from "react-bootstrap/Button";
import {Col, ModalBody, ModalHeader, Row, Table} from "reactstrap";
import * as ReactBootstrap from 'react-bootstrap'
import DatePicker from "react-datepicker";
import {Modal} from "react-bootstrap";
import LocationForm from "../admin/location-from";
import axios from "axios";
import {HOST} from "../../hosts";


class AvailableCourts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            data: [],
            locations: [],
            location: {
                details: null
            },
            courts: [],
            court:{
                id: null,
                number: null
            },
            availableCourtsDara: []
        };

        this.handleChangeStartDate=this.handleChangeStartDate.bind(this);
    }
    componentDidMount() {
        //this.updateHours();
        this.fetchLocations();
    }

    handleChangeStartDate(date) {
        this.setState({
            startDate: date
        })
    }

    updateHours(hoursInfo){
        let result = [];
        for(let i=0;i<23;i++)
        {
            result.push({time:hoursInfo[i].hour+"-"+hoursInfo[i+1].hour,status:hoursInfo[i].status})
        }
        result.push({time:hoursInfo[23].hour+"-00",status:hoursInfo[23].status})
        let data= [
                        {time: "00-01", status: "ocupat"},
                        {time: "01-02", status: "ocupat"},
                        {time: "02-03", status: "ocupat"},
                        {time: "04-05", status: "liber"},
                        {time: "05-06", status: "ocupat"},
                    ]
        this.setState({data:result})

    }
    fetchAvailableCourtsHours(){
        console.log(this.state.court.id);
        const body = {
            "startDate": this.state.startDate,
            "courtId": this.state.court.id,
        };
        console.log("apel");
        axios.post(HOST.backend_api + '/court/seeCourtAvailability', body, {
            headers: {
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res) => {
            this.updateHours(res.data);
        }).catch(err => console.log(err))
    }
    renderAvailableTimeSlots = (slots) =>
    {
        return(
            <tr key={slots.time}>
                <td >{slots.time}</td>
                {slots.status===true ? <td style={{background:"red",textAlign:"center"}}><strong>Ocupat</strong></td> : <td style={{background:"green",textAlign:"center"}}><strong>Liber</strong></td>}
            </tr>
        )
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
    renderLocations = (loc) =>
    {
        return(
            <div key={loc.id} className="dropdown-item" style={{marginTop: 10}} onClick={()=>{
                this.setState({
                    location:{
                        details: loc.details
                    },
                    court:{
                        id: null,
                        number: null
                    }
                });
                this.fetchCourts(loc.id);
            }}>{loc.details}</div>

        )
    }

    renderCourts = (court) =>
    {
        return(
            <div key={court.id} className="dropdown-item" style={{marginTop: 10}} onClick={()=>{
                this.setState({
                        location: {
                            details: this.state.location.details
                        },
                        court:{
                            id: court.id,
                            number: court.number
                        }
                });
            }}>{court.number}</div>

        )
    }

    render() {
        return (
            <div>
                <Row>
                    <Col style={{maxWidth:'200px', width:'200px'}}>
                        <DatePicker
                            selected={ this.state.startDate }
                            onChange={ this.handleChangeStartDate }
                            dateFormat="d MMMM yyyy"
                            minDate={new Date()}
                        />
                    </Col >
                    <Col style={{maxWidth:'120px'}}>
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Location
                        </button>
                        <div className="dropdown-menu overflow-scroll" aria-labelledby="dropdownMenuButton">
                            {this.state.locations.map(this.renderLocations)}
                        </div>
                    </Col>
                    <Col style={{maxWidth:'200px'}}>
                        <div>Selected option:  <strong>{this.state.location.details }</strong> </div>
                    </Col>
                    <Col>
                        {this.state.location.details!==null ?
                            (
                                    <Col>
                                        <button className="btn btn-secondary dropdown-toggle" type="button"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                        >
                                            Courts

                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {this.state.courts.map(this.renderCourts)}
                                        </div>
                                    </Col>
                            )
                            :
                            null}
                    </Col>
                    <Col>
                        {this.state.location.details!==null ?
                            (
                                <div>Selected option:  <strong>{this.state.court.number }</strong></div>
                            )
                            :
                            null}
                    </Col>
                    <Row>
                    <Col>
                        <button className="btn btn-secondary " type="button"
                                onClick={()=>{this.fetchAvailableCourtsHours()}}
                        >
                            Search
                        </button>
                    </Col>
                    </Row>
                </Row>
                <Table className="mt-2" striped bordered hover>
                    <thead>
                    <tr>
                        <th>time</th>
                        <th>status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.data.map(this.renderAvailableTimeSlots)}
                    </tbody>
                </Table>
            </div>


        ) ;
    }
}

export default AvailableCourts;