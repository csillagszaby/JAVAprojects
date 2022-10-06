import React from "react";
import "../styles.css"
import {Modal} from "react-bootstrap";
import {ModalBody, ModalHeader} from "reactstrap";
import MonthlySubscriptionForm from "./monthly-subscription-form";
import {HOST} from "../hosts";
import "../styles.css"
import "../styles.css";
import background from "../images/tenis.jpg";
import ReservationForm from "./reservation-form";
import axios from "axios";
class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations:[],
            showMonthlySubscription: false,
            showReservation:false,
            selectedLocation: null,
            selectedCourt: null,
            courts:[],
        }


        this.handleCloseMonthlySubscription=this.handleCloseMonthlySubscription.bind(this);
        this.handleShowMonthlySubscription=this.handleShowMonthlySubscription.bind(this);
        this.handleShowReservation=this.handleShowReservation.bind(this);
        this.handleCloseReservation=this.handleCloseReservation.bind(this);
    }

    handleShowMonthlySubscription = () =>
    {
        this.setState({
            showMonthlySubscription : true
        })
    }

    handleCloseMonthlySubscription = () => {
        this.setState({
            showMonthlySubscription: false
        })
    }
    handleShowReservation = () =>
    {
        this.setState({
            showReservation : true
        })
    }

    handleCloseReservation = () => {
        this.setState({
            showReservation: false
        })
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

    componentDidMount() {
        this.fetchCourts();
        this.fetchLocations();
    }
    render() {

        return (
            <div >
                <h1 style={{color: "white"}}>Client Page</h1>
                <button type="button" className="btn btn-primary btn-block" onClick={this.handleShowMonthlySubscription}>
                    Create Monthly Subscription
                </button>
                <Modal dialogClassName="client-modal" show={this.state.showMonthlySubscription} onHide={this.handleCloseMonthlySubscription}>
                    <ModalHeader>
                        <Modal.Title>Please write down the location details</Modal.Title>
                    </ModalHeader>
                    <ModalBody>
                        <MonthlySubscriptionForm handleClose={this.handleCloseMonthlySubscription}/>
                    </ModalBody>
                </Modal>
                <div>
                    <button type="button" className="btn btn-primary btn-block" onClick={this.handleShowReservation}>
                        Add Reservation
                    </button>
                    <Modal dialogClassName="client-modal" show={this.state.showReservation} onHide={this.handleCloseReservation}>
                        <ModalHeader>
                            <Modal.Title>Please write down the reservation details</Modal.Title>
                        </ModalHeader>
                        <ModalBody>
                            <ReservationForm handleClose={this.handleCloseReservation}/>
                        </ModalBody>
                    </Modal>
                </div>
            </div>

        );
    }
}
export default ClientComponent
