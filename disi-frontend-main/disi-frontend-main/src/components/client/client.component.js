import React from "react";
import "../../styles.css"
import {Col, Container, Modal, Row} from "react-bootstrap";
import {ModalBody, ModalHeader} from "reactstrap";
import MonthlySubscriptionForm from "./monthly-subscription-form";
import {HOST} from "../../hosts";
import ReservationForm from "./reservation-form";
import axios from "axios";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import AvailableCourts from "./available-courts";

import SockJsClient from 'react-stomp';
import { ToastContainer , toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_URL=HOST.backend_api + "/ws";
// const customHeaders = {
//     "Authorization":`${localStorage.getItem('jwt')}`,
//     "Access-Control-Allow-Origin":"*"//,
//     //'Access-Control-Allow-Credentials': 'true'
// };

class ClientComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stompClient : null,
            socketMessage: "",
            isLoadedSocket:false,
            locations:[],
            showMonthlySubscription: false,
            showReservation:false,
            selectedLocation: null,
            selectedCourt: null,
            courts:[],
            cards: [],
            subscriptions:[],
            showAvailableCourts: false,
            currentTime: new Date(),
            cardsWithFindingStatus: []
        }


        this.handleCloseMonthlySubscription=this.handleCloseMonthlySubscription.bind(this);
        this.handleShowMonthlySubscription=this.handleShowMonthlySubscription.bind(this);
        this.handleShowAvailableCourts=this.handleShowAvailableCourts.bind(this);
        this.handleCloseAvailableCourts=this.handleCloseAvailableCourts.bind(this);
        this.handleCloseReservation=this.handleCloseReservation.bind(this);
    }
    onConnected = () => {
        console.log("Connected!!");
    }

    onMessageReceived = (msg) => {
        this.setState({
            socketMessage:msg.message,
            isLoadedSocket: true
        })
        console.log("A fost primit mesaj de la WebSocket: " + msg.message);
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
    handleShowAvailableCourts = () =>
    {
        this.setState({
            showAvailableCourts : true
        })
    }

    handleCloseAvailableCourts = () => {
        this.setState({
            showAvailableCourts: false
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



    renderLocations = (loc) =>
    {
        return(
            <a className="dropdown-item">{loc.details}</a>

        )
    }

    fetchCards(){
        axios.get(HOST.backend_api+'/reservation/getUserReservations/'+sessionStorage.getItem("clientId"),{
            headers:{"Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{

            this.setState({cards: res.data})
            //console.log("cards:"+this.state.cards);
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }
    fetchSubscriptions(){
        axios.get(HOST.backend_api+'/subscription/getUserSubscriptions/'+sessionStorage.getItem("clientId"),{
            headers:{"Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            this.setState({subscriptions: res.data})
            console.log(this.state.subscriptions);
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }


    fetchFindingStatusCards(){
        axios.get(HOST.backend_api+'/reservation/getReservationsHavingFindingStatus',{
            headers:{"Authorization":`${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin":"*"
            }
        }).then((res)=>{
            this.setState({cardsWithFindingStatus: res.data})
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }
    componentDidMount() {
        this.fetchCourts();
        this.fetchLocations();
        this.fetchCards();
        this.fetchFindingStatusCards();
        this.fetchSubscriptions();
    }

    handleCancelReservationButton(id){

        const body = {
            "id": id
        };
        axios.post(HOST.backend_api+'/reservation/successfullyCancel',body,{
            headers:{
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res)=>{
            console.log("canceled");
            this.fetchCards();
            this.fetchFindingStatusCards();
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }
    handlePayReservationButton(id){

        const body = {
            "id": id
        };
        axios.post(HOST.backend_api+'/reservation/pay',body,{
            headers:{
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res)=>{
                this.fetchCards();
                this.fetchFindingStatusCards();
                alert("Successfully paid");
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }

    handleFindTwoPlayersButton(id){

        const body = {
            "id": id
        };
        axios.post(HOST.backend_api+'/reservation/findTwoPlayers',body,{
            headers:{
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res)=>{
                this.fetchCards();
                this.fetchFindingStatusCards();
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }

    handleEnrollMeButton(reservationId){

        const body = {
            "reservationId": reservationId,
            "userId": sessionStorage.getItem("clientId")
        };
        axios.post(HOST.backend_api+'/person/enrollMe',body,{
            headers:{
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res)=>{
            console.log(res.data);
            if(res.data==="This person is already enrolled at this reservation")
            {
                alert("You have already been enrolled");
            }
            this.fetchCards();
            this.fetchFindingStatusCards();

        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }


    handleFindOnePlayerButton(id){

        const body = {
            "id": id
        };
        axios.post(HOST.backend_api+'/reservation/findOnePlayer',body,{
            headers:{
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res)=>{
            this.fetchCards();
            this.fetchFindingStatusCards();
        }).catch(err => {
            alert("something went wrong, try again")
            console.log(err)})
    }

    renderCards= (data)=>{
        let currentDate = new Date();
        let cardDate = new Date(data.startTime);
        let hoursDifference= cardDate - currentDate;
        let seconds = Math.floor(hoursDifference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
            return(
                    <MDBCard key={data.id} className="m-2" style={{maxWidth: '350px', maxHeight: '400px', height: '310px', background: (hours>0) ? '#FFFFFF' : '#F5A6A6'}}>
                    <MDBCardBody>
                        <MDBCardTitle>Reservation at: {data.court.location.details}</MDBCardTitle>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Court number: {data.court.number}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Player1: {data.player1 !== null ? data.player1.name : null}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Player2: {data.player2 !== null ? data.player2.name : null}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Status: {data.status}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Start time: {(data.startTime).substring(0, 19)}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>End time: {(data.endTime).substring(0, 19)}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        {hours>24 ?
                            (
                                <div>
                                    {hours>0 ?
                                        (<div>
                                            <Row>
                                        <Col>
                                            <MDBCardText>
                                                <strong>Price: {data.price}</strong>
                                            </MDBCardText>
                                        </Col>
                                        <Col>
                                            <MDBBtn className="btn-success" style={{
                                                maxWidth: '150px',
                                                width: '150px',
                                                maxHeight: '30px',
                                                height: "30px",
                                                fontSize: 13,
                                            }}
                                                    onClick={() => this.handlePayReservationButton(data.id)}
                                            >Pay</MDBBtn>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2" >
                                        <Col style={{maxWidth: 160}}>
                                            <MDBBtn className="btn-primary" style={{
                                                maxWidth: '150px',
                                                width: '150px',
                                                maxHeight: '30px',
                                                height: "30px",
                                                fontSize: 13,
                                                marginRight: 2
                                            }}
                                                    onClick={() => this.handleFindTwoPlayersButton(data.id)}
                                            >Find two players</MDBBtn>
                                        </Col>
                                        <Col style={{maxWidth: 160}}>
                                            <MDBBtn className="btn-primary" style={{
                                                maxWidth: '150px',
                                                width: '150px',
                                                maxHeight: '30px',
                                                height: "30px",
                                                fontSize: 13,
                                                marginRight: 2
                                            }}
                                                    onClick={() => this.handleFindOnePlayerButton(data.id)}
                                            >Find one player</MDBBtn>
                                        </Col>
                                    </Row>
                                </div>) : null}
                                    <Row className="mt-2" style={{position: 'absolute', left: '50%'}}>
                                        <Col style={{maxWidth: 160}}>
                                            <MDBBtn className="btn-danger" style={{
                                                maxWidth: '150px',
                                                width: '150px',
                                                maxHeight: '30px',
                                                height: "30px",
                                                fontSize: 13,
                                                marginRight: 2
                                            }}
                                                    onClick={() => this.handleCancelReservationButton(data.id)}
                                            >Cancel reservation</MDBBtn>
                                        </Col>
                                    </Row>
                                </div>)


                            :
                            (
                                <div>
                                    {hours>0 ?
                                        (<div>
                                <Row>
                                <Col>
                                    <MDBCardText>
                                        <strong>Price: {data.price}</strong>
                                    </MDBCardText>
                                </Col>
                                    <Col>
                                        <MDBBtn className="btn-success" style={{
                                            maxWidth: '150px',
                                            width: '150px',
                                            maxHeight: '30px',
                                            height: "30px",
                                            fontSize: 13,
                                        }}
                                                onClick={() => this.handlePayReservationButton(data.id)}
                                        >Pay</MDBBtn>
                                    </Col>
                            </Row>
                            <Row className="mt-2" >
                            <Col style={{maxWidth: 160}}>
                            <MDBBtn className="btn-primary" style={{
                            maxWidth: '150px',
                            width: '150px',
                            maxHeight: '30px',
                            height: "30px",
                            fontSize: 13,
                            marginRight: 2
                        }}
                            onClick={() => this.handleFindTwoPlayersButton(data.id)}
                            >Find two players</MDBBtn>
                            </Col>
                            <Col style={{maxWidth: 160}}>
                            <MDBBtn className="btn-primary" style={{
                            maxWidth: '150px',
                            width: '150px',
                            maxHeight: '30px',
                            height: "30px",
                            fontSize: 13,
                            marginRight: 2
                        }}
                            onClick={() => this.handleFindOnePlayerButton(data.id)}
                            >Find one player</MDBBtn>
                            </Col>
                            </Row>
                                    </div>) : null}
                                    </div>
                                        )
                                    }
                    </MDBCardBody>
                </MDBCard>
        )
    }

    renderCardsWithStatus= (data)=>{

            return(
                <MDBCard key={data.id} className="m-2" style={{maxWidth: '350px', maxHeight: '400px', height: '310px'}}>
                    <MDBCardBody>
                        <MDBCardTitle>Reservation at: {data.court.location.details}</MDBCardTitle>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Court number: {data.court.number}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Status: {data.status}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Player1: {data.player1 !== null ? data.player1.name : null }</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Player2: {data.player2 !== null ? data.player2.name : null }</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Start time: {(data.startTime).substring(0, 19)}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>End time: {(data.endTime).substring(0, 19)}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MDBCardText>
                                    <strong>Price: {data.price}</strong>
                                </MDBCardText>
                            </Col>
                        </Row>
                        <Row className="mt-2" style={{position: 'absolute', left: '50%'}}>
                            <Col>
                                <MDBBtn className="btn-primary" style={{
                                    maxWidth: '150px',
                                    width: '150px',
                                    maxHeight: '30px',
                                    height: "30px",
                                    fontSize: 13,
                                    marginRight: 2
                                }}
                                        onClick={() => this.handleEnrollMeButton(data.id)}
                                >Enroll me</MDBBtn>
                            </Col>
                        </Row>
                    </MDBCardBody>
                </MDBCard>
            )
        }
    renderSubscriptions= (data)=>{

        return(
            <MDBCard key={data.id} className="m-2" style={{maxWidth: '350px', maxHeight: '400px', height: '200px'}}>
                <MDBCardBody>
                    <MDBCardTitle>Subscription at: {data.court.location.details}</MDBCardTitle>
                    <Row>
                        <Col>
                            <MDBCardText>
                                <strong>Court number: {data.court.number}</strong>
                            </MDBCardText>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MDBCardText>
                                <strong>Month: {(data.month).substring(0, 19)}</strong>
                            </MDBCardText>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MDBCardText>
                                <strong>Start hour: {(data.startHour).substring(0, 19)}</strong>
                            </MDBCardText>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MDBCardText>
                                <strong>End hour: {(data.endHour).substring(0, 19)}</strong>
                            </MDBCardText>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MDBCardText>
                                <strong>Price: {(JSON.stringify(data.price)).substring(0, 19)}</strong>
                            </MDBCardText>
                        </Col>
                    </Row>
                </MDBCardBody>
            </MDBCard>
        )
    }

    render() {

        let onConnected = () => {
            console.log("Connected!!")
        }
        let onDisConnected = () => {
            console.log("DisConnected!!")
        }
        let onMessageReceived = (msg) => {
            console.log("received!!")
            toast(msg.reservation_id);
        }
        if(window.sessionStorage.getItem("loggedIn") !== 'true')
            window.location.href='/home';
        return (
            <Container>
                <div>
                <ToastContainer />
                <SockJsClient
                    url={SOCKET_URL}
                    //headers={customHeaders}
                    topics={['/topic/message/'+sessionStorage.getItem("clientId")]}
                    onConnect={onConnected()}
                    onDisconnect={onDisConnected()}
                    onMessage={msg => onMessageReceived(msg)}
                    debug={true}
                />
                </div>
                {/*{ this.state.isLoadedSocket && <div style={{color: "red"}}>{this.state.socketMessage}</div>}*/}
                <h1 style={{color: "black", textAlign: 'center'}}>Client Page</h1>
                <button type="button" className="btn btn-primary btn-block" onClick={this.handleShowMonthlySubscription}>
                    Create Monthly Subscription
                </button>
                <Modal dialogClassName="client-modal" show={this.state.showMonthlySubscription} onHide={this.handleCloseMonthlySubscription}>
                    <ModalHeader>
                        <Modal.Title>Create a monthly subscription</Modal.Title>
                    </ModalHeader>
                    <ModalBody>
                        <MonthlySubscriptionForm handleClose={this.handleCloseMonthlySubscription}/>
                    </ModalBody>
                </Modal>
                <button type="button" className="btn btn-primary btn-block m-lg-2" onClick={this.handleShowAvailableCourts}>
                    See available courts
                </button>
                <Modal dialogClassName="available-courts-modal" show={this.state.showAvailableCourts} onHide={this.handleCloseAvailableCourts}>
                    <ModalHeader>
                        <Modal.Title>Available Courts</Modal.Title>
                    </ModalHeader>
                    <ModalBody>
                        <AvailableCourts handleClose={this.handleCloseAvailableCourts}/>
                    </ModalBody>
                </Modal>
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
                <div style={{background: "#73E2BB", marginTop: 50}}>
                <h1 style={{color: "black", textAlign: 'center'}}>My reservations</h1>
                <div className="mt-4 flex-row cardsBox" style={{maxHeight: '350px', overflowX: 'hidden', overflowY:'scroll'}}>

                    {this.state.cards.map(this.renderCards)}
                </div>
                </div>

                <div style={{background: "#73E2BB", marginTop: 50}}>
                <h1 style={{color: "black", textAlign: 'center'}}>Other reservations</h1>
                <div className="mt-4 flex-row cardsBox" style={{maxHeight: '350px', overflowX: 'hidden', overflowY:'scroll'}}>
                    {this.state.cardsWithFindingStatus.map(this.renderCardsWithStatus)}
                </div>
                </div>

                <div style={{background: "#73E2BB", marginTop: 50}}>
                <h1 style={{color: "black", textAlign: 'center'}}>Subscriptions</h1>
                <div className="mt-4 flex-row cardsBox" style={{maxHeight: '350px', overflowX: 'hidden', overflowY:'scroll'}}>
                    {this.state.subscriptions.map(this.renderSubscriptions)}
                </div>
                </div>
            </Container>

        );
    }
}
export default ClientComponent
