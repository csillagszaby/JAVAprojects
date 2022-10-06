import React from "react";
import {ModalBody, ModalHeader, Table} from "reactstrap";
import {Modal} from "react-bootstrap";
import LocationForm from "./location-from";
import CourtForm from "./court-form";
import axios from "axios";
import {HOST} from "../../hosts";
import TariffForm from "./tariff-form";

export default class AdminComponent extends React.Component {

    constructor(props) {
        super(props);
        //this.toggleForm=this.toggleForm.bind(this);
        this.state = {
            selectedLocation: null,
            selectedCourt: null,
            locations: [],
            courts:[],
            show: false,
            showCourt: false,
            showUpdateModal:false,
            showTariff: false,
            isLoaded: false,
            showUpdateModalCourt:false,
            isLoadedCourt: false,
            reservations: [],
            subscriptions: []
        }
        this.handleShow=this.handleShow.bind(this);
        this.handleShowCourt=this.handleShowCourt.bind(this);
        this.handleShowTariff=this.handleShowTariff.bind(this);
        this.handleCloseUpdateModal=this.handleCloseUpdateModal.bind(this);
        this.handleCloseUpdateModalCourt=this.handleCloseUpdateModalCourt.bind(this);
        this.handleShowUpdateModal=this.handleShowUpdateModal.bind(this);
        this.handleShowUpdateModalCourt=this.handleShowUpdateModalCourt.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.handleCloseTariff=this.handleCloseTariff.bind(this);
        this.handleCloseCourt=this.handleCloseCourt.bind(this);
        this.reloadTable=this.reloadTable.bind(this);
        this.reloadTableCourt=this.reloadTableCourt.bind(this);
    }

    reloadTable() {
        this.setState({
            isLoaded: false
        });
        this.fetchLocations();
    }
    reloadTableCourt() {
        this.setState({
            isLoadedCourt: false
        });
        this.fetchCourts();
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
    fetchCourts(){
        axios.get(HOST.backend_api+'/court/getAllCourts',{
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            //console.log(res.data);
            this.setState({
                courts : res.data
            });
        }).catch(err=>console.log(err))
    }

    fetchReservations(){
        axios.get(HOST.backend_api+'/reservation/getAllReservations',{
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            //console.log(res.data);
            this.setState({
                reservations : res.data
            });
        }).catch(err=>console.log(err))
    }

    fetchSubscriptions(){
        axios.get(HOST.backend_api+'/subscription/getAllSubscriptions',{
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            //console.log(res.data);
            this.setState({
                subscriptions : res.data
            });
        }).catch(err=>console.log(err))
    }

    componentDidMount() {
        this.fetchLocations();
        this.fetchCourts();
        this.fetchReservations();
        this.fetchSubscriptions();
    }

    deleteLocation(id){

        axios.delete(HOST.backend_api+'/location/deleteLocation',{
            data:{
                "id": id
            },
            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }

        }).then(()=>{
            this.reloadTable();
        }).catch(err=>console.log(err))
    }

    renderLocations = (loc) =>
    {
        return(
            <tr key={loc.id}>
                <td >{loc.id}</td>
                <td colSpan ={3}>{loc.details}</td>
                <td style={{textAlign:"right"}}><button type="button" className="btn btn-primary btn-block"
                                                        onClick={()=>{
                                                            this.handleShowUpdateModal();
                                                            this.setSelectedLocationID(loc.id);
                                                        }
                                                        }
                >Update location</button></td>
                <td style={{textAlign:"right"}}><button type="button" className="btn btn-danger btn-block"
                                                        onClick={()=>{
                                                            this.deleteLocation(loc.id);
                                                        }}
                >Delete Location</button></td>
            </tr>
        )
    }

    deleteCourt(id){
        axios.delete(HOST.backend_api+'/court/deleteCourt/'+id,{

            headers:{
                "Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }

        }).then(()=>{
            this.reloadTableCourt();
        }).catch(err=>console.log(err))
    }

    renderCourts = (court) =>
    {
        return(
            <tr key={court.id}>
                <td >{court.id}</td>
                <td colSpan ={3}>{court.number}</td>
                <td colSpan ={3}>{court.location.details}</td>
                <td style={{textAlign:"right"}}><button type="button" className="btn btn-primary btn-block"
                                                        onClick={()=>{
                                                            this.handleShowUpdateModalCourt();
                                                            this.setSelectedCourtID(court.id);
                                                        }
                                                        }
                >Update Court</button></td>
                <td style={{textAlign:"right"}}><button type="button" className="btn btn-danger btn-block"
                                                        onClick={()=>{
                                                            this.deleteCourt(court.id);
                                                        }}
                >Delete Court</button></td>
            </tr>
        )
    }

    renderReservations = (reservation) =>
    {
        return(
            <tr key={reservation.id}>
                <td >{reservation.createdBy.name}</td>
                <td >{reservation.court.location.details}</td>
                <td >{reservation.court.number}</td>
                <td >{ (reservation.startTime).substring(0,19)}</td>
                <td >{ (reservation.endTime).substring(0,19)}</td>
                <td >{reservation.player1 !== null ? reservation.player1.name : null}</td>
                <td >{reservation.player2 !== null ? reservation.player2.name : null}</td>
                <td >{reservation.status}</td>
            </tr>
        )
    }

    renderSubscriptions = (subscription) =>
    {
        return(
            <tr key={subscription.id}>
                <td >{subscription.createdBy.name}</td>
                <td >{subscription.court.location.details}</td>
                <td >{subscription.court.number}</td>
                <td >{subscription.month}</td>
                <td >{subscription.startHour}</td>
                <td >{subscription.endHour}</td>
                <td >{subscription.price}</td>
            </tr>
        )
    }

    handleShow = () => {this.setState({show : true})}
    handleShowCourt = () => {this.setState({showCourt : true})}
    setSelectedLocationID(id){this.setState({selectedLocation: id})}
    setSelectedCourtID(id){this.setState({selectedCourt: id})}
    handleShowUpdateModal = () => {this.setState({showUpdateModal : true})}
    handleShowUpdateModalCourt = () => this.setState({showUpdateModalCourt:true})
    handleCloseUpdateModal = () => {this.setState({showUpdateModal: false})}
    handleCloseUpdateModalCourt = () => {this.setState({showUpdateModalCourt: false})}
    handleClose = () => {this.setState({show: false})}
    handleCloseCourt = () => {this.setState({showCourt: false})}
    handleCloseTariff = () => {
        this.setState({
            showTariff: false
        })
    }
    handleShowTariff = () =>
    {
        this.setState({
            showTariff : true
        })
    }
    render() {
        if(window.sessionStorage.getItem("isAdmin") !== 'true')
            window.location.href='/home';
        return (

                <div>
                    <div  className="bg-transparent" style={{textAlign: "center", color: "black"}} ><h1>Admin Page</h1></div>
                            <div className="mt-1 col-md-12" style={{background: "#BED3CC",padding:"10px 10px 10px 10px", borderRadius:"10px"}}>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th colSpan ={4} style={{textAlign: "center"}}>Locations</th>
                                            <th style={{textAlign: "right"}} >
                                                <button type="button" className="btn btn-primary btn-block" onClick={this.handleShow}>
                                                    Add Location
                                                </button>
                                                <Modal show={this.state.show} onHide={this.handleClose}>
                                                    <ModalHeader>
                                                        <Modal.Title>Please write down the location details</Modal.Title>
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <LocationForm reloadHandler={this.reloadTable} isUpdate={false} handleClose={this.handleClose}/>
                                                    </ModalBody>
                                                </Modal>

                                                <Modal show={this.state.showUpdateModal} onHide={this.handleCloseUpdateModal}>
                                                    <ModalHeader>
                                                        <Modal.Title>Update the location details</Modal.Title>
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <LocationForm reloadHandler={this.reloadTable} isUpdate={true} locationId={this.state.selectedLocation} handleClose={this.handleCloseUpdateModal}/>
                                                    </ModalBody>
                                                </Modal>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.locations.map(this.renderLocations)}
                                        </tbody>
                                    </Table>
                            </div>


                    <div className="mt-4 col-md-12 bg-transparent">
                        <button type="button" className="btn btn-primary btn-block" onClick={this.handleShowTariff}>
                            Add tariff
                        </button>
                        <Modal show={this.state.showTariff} onHide={this.handleCloseTariff}>
                            <ModalHeader>
                                <Modal.Title>Please enter values</Modal.Title>
                            </ModalHeader>
                            <ModalBody>
                                <TariffForm  handleClose={this.handleCloseTariff}/>
                            </ModalBody>
                        </Modal>
                    </div>
                    <div className="mt-1 col-md-12" style={{background: "#BED3CC",padding:"10px 10px 10px 10px", borderRadius:"10px"}}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th colSpan ={3} style={{textAlign: "center"}}>Number</th>
                                <th colSpan ={4} style={{textAlign: "center"}}>Location</th>
                                <th style={{textAlign: "center"}} >
                                    <button type="button" className="btn btn-primary btn-block" onClick={this.handleShowCourt}>
                                        Add Court
                                    </button>
                                    <Modal show={this.state.showCourt} onHide={this.handleCloseCourt}>
                                        <ModalHeader>
                                            <Modal.Title>Please write down the Court Number and select the location</Modal.Title>
                                        </ModalHeader>
                                        <ModalBody>
                                            <CourtForm  reloadHandler={this.reloadTableCourt} isUpdate={false}
                                                        locations={this.state.locations}
                                                        handleClose={this.handleCloseCourt}/>
                                        </ModalBody>
                                    </Modal>

                                    <Modal show={this.state.showUpdateModalCourt} onHide={this.handleCloseUpdateModalCourt}>
                                        <ModalHeader>
                                            <Modal.Title>Update the court</Modal.Title>
                                        </ModalHeader>
                                        <ModalBody>
                                            <CourtForm reloadHandler={this.reloadTableCourt}  isUpdate={true} locations={this.state.locations}
                                                       courtId={this.state.selectedCourt} handleClose={this.handleCloseUpdateModalCourt}/>
                                        </ModalBody>
                                    </Modal>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.courts.map(this.renderCourts)}
                            </tbody>
                        </Table>
                    </div>


                    <div className="col-md-12" style={{background: "#BED3CC",padding:"10px 10px 10px 10px", borderRadius:"10px",marginTop: 50}}>
                        <h1 style={{color: "black", textAlign: 'center'}}>Reservations</h1>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>CreatedBy</th>
                                <th style={{textAlign: "center"}}>Location</th>
                                <th style={{textAlign: "center"}}>Court</th>
                                <th style={{textAlign: "center"}}>Start Date</th>
                                <th style={{textAlign: "center"}}>End Date</th>
                                <th style={{textAlign: "center"}}>Player 1</th>
                                <th style={{textAlign: "center"}}>Player 2</th>
                                <th style={{textAlign: "center"}}>Status </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.reservations.map(this.renderReservations)}
                            </tbody>
                        </Table>
                    </div>

                    <div className="col-md-12" style={{background: "#BED3CC",padding:"10px 10px 10px 10px", borderRadius:"10px",marginTop: 50}}>
                        <h1 style={{color: "black", textAlign: 'center'}}>Subscriptions</h1>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>CreatedBy</th>
                                <th style={{textAlign: "center"}}>Location</th>
                                <th style={{textAlign: "center"}}>Court number</th>
                                <th style={{textAlign: "center"}}>Month </th>
                                <th style={{textAlign: "center"}}>Start hour</th>
                                <th style={{textAlign: "center"}}>End hour</th>
                                <th style={{textAlign: "center"}}>Price </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.subscriptions.map(this.renderSubscriptions)}
                            </tbody>
                        </Table>
                    </div>


                </div>

        );
    }
}