import React from 'react';
import Button from "react-bootstrap/Button";
import {Col, ModalBody, ModalHeader, Row} from "reactstrap";
import 'bootstrap/dist/js/bootstrap'
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { FormGroup} from 'reactstrap';
import axios from "axios";
import {HOST} from "../../hosts";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {Modal} from "react-bootstrap";
import LoadingModal from "../../commons/loading-modal";



class MonthlySubscriptionForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose=this.props.handleClose;
        this.state = {
            formIsValid: false,
            date: new Date(),
            startHour: '00',
            endHour: '00',
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            startHourOptions: [],
            endHourOptions:[],
            monthsOptions:[],
            selectedMonth: null,
            locations: [],
            courts: [],
            loaded: false,
            loadingModalShow: false,
            loadingModalClose: false,
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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShowLoadingModal=this.handleShowLoadingModal.bind(this);
        this.handleCloseLoadingModal=this.handleCloseLoadingModal.bind(this);
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
        this.getHourOptions();
        this.getMonthsOptions();
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

    getHourOptions(){

        let hours = [];
        for(let i=0;i<24;i++){
            if(i<10)
                hours.push('0'+i);
            else hours.push(i);
        }
        const options = hours.map(val => ({
            "value" : val,
            "label" : val

        }))
        this.setState({startHourOptions: options})

    }
    getEndHourOptions= (start)=>{

        let hours = [];
        for(let i=parseInt(start)+1;i<24;i++){
            if(i<10)
                hours.push('0'+i);
            else hours.push(i);
        }
        const options = hours.map(val => ({
            "value" : val,
            "label" : val

        }))
        this.setState({endHourOptions: options})

    }
    getMonthsOptions(){

        const options = this.state.months.map(val => ({
            "value" : val,
            "label" : val

        }))
        this.setState({monthsOptions: options})

    }

    checkIfValid= async ()=>{
        await this.setState();
        if(this.state.formControls.court.number!==null && (parseInt(this.state.startHour) < parseInt(this.state.endHour))){
            this.setState({formIsValid: true})
        }else this.setState({formIsValid: false})
    }

    handleSubmit() {
        if(parseInt(this.state.startHour) > parseInt(this.state.endHour))
        {
            alert("start hour must be lower than end hour");
        }
        else {
            const body = {
                "createdById": sessionStorage.getItem("clientId"),
                "courtId": this.state.formControls.court.id,
                "month": this.state.selectedMonth,
                "startHour": this.state.startHour,
                "endHour": this.state.endHour
            };
            axios.post(HOST.backend_api + '/subscription/addSubscription', body, {
                headers: {
                    "Authorization": `${localStorage.getItem('jwt')}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                console.log(res.data);
                this.handleClose();

                if(res.data==='ok')
                {
                    this.setState({loaded:true})
                }else this.setState({loaded:false})
            }).catch(err => console.log(err))
            this.handleShowLoadingModal();
        }
    }
    handleShowLoadingModal = () =>
    {
        this.setState({
            loadingModalShow : true
        })
    }

    handleCloseLoadingModal = () => {
        this.setState({
            loadingModalClose: false
        })
    }
    render() {
        return (
            <div>

                <FormGroup id='monthlySubscription'>

                    <div className="dropdown">
                        <Row>
                            <Col style={{maxWidth:'70px'}}>
                                <div style={{marginTop: 5}}> Location: </div>
                            </Col>
                            <Col>
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{marginTop: 5}}>
                                    Location
                                </button>
                                <div className="dropdown-menu overflow-scroll" aria-labelledby="dropdownMenuButton">
                                    {this.state.locations.map(this.renderLocations)}
                                </div>
                            </Col>
                            <Col>
                                <div style={{marginTop: 5}}>Selected option:  <strong>{this.state.formControls.location.details }</strong> </div>
                            </Col>
                        </Row>
                    </div>
                    {this.state.formControls.location.details!==null ?
                        (<div className="dropdown">
                            <Row className="mt-2">
                                <Col style={{maxWidth:'70px'}}>
                                    <div style={{marginTop: 5}}> Court: </div>
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
                                    <div style={{marginTop: 5}}>Selected option:  <strong>{this.state.formControls.court.number }</strong></div>
                                </Col>
                            </Row>
                        </div>)
                        :
                        null}
                    <div>
                        <Row className="mt-2">
                            <Col style={{maxWidth:'55px'}}>
                                <div style={{marginTop: 5}}> Month: </div>
                            </Col>
                            <Col style={{maxWidth:'150px'}}>
                                <Select options={this.state.monthsOptions} onChange={(sel)=>{
                                    this.setState({selectedMonth: sel.value});

                                }}/>
                            </Col>
                            <Col style={{maxWidth:'100px'}}>
                                <div style={{marginTop: 5}}> Start hour: </div>
                            </Col>
                            <Col>
                                <Select options={this.state.startHourOptions} onChange={(sel)=>{
                                    this.setState({startHour: sel.value});
                                    this.getEndHourOptions(sel.value);
                                }}/>
                            </Col>
                            <Col style={{maxWidth:'100px'}}>
                                <div style={{marginTop: 5}}> End hour: </div>
                            </Col>
                            <Col>
                                <Select options={this.state.endHourOptions} onChange={(sel)=>{
                                    this.setState({endHour: sel.value});
                                    this.checkIfValid();

                                }}/>
                            </Col>
                        </Row>
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
                <Modal  show={this.state.loadingModalShow} onHide={this.handleCloseLoadingModal}>
                    <ModalHeader>
                        <Modal.Title>Processing... please wait</Modal.Title>
                    </ModalHeader>
                    <ModalBody style={{maxHeight: '100px', height: '100px'}}>
                        <LoadingModal loaded={this.state.loaded} handleClose={this.handleCloseLoadingModal}/>
                    </ModalBody>
                </Modal>



            </div>

        ) ;
    }
}

export default MonthlySubscriptionForm;