import React from "react";
import "../../styles.css";
import axios from "axios";
import {HOST} from "../../hosts";
import {ModalBody, ModalHeader, Table} from "reactstrap";
import {Modal} from "react-bootstrap";
import AvailableCourts from "../client/available-courts";

class HomeComponent extends React.Component {

    constructor(props) {
        super(props);
        //this.toggleForm=this.toggleForm.bind(this);
        this.state = {
            locations: [],
            courts:[],
            showAvailableCourts: false
        }
    }

    renderCourts = (court) =>
    {
        return(
            <tr key={court.id}>
                <td>{court.id}</td>
                <td>{court.number}</td>
                <td>{court.location.details}</td>
            </tr>
        )
    }

    renderLocations = (loc) =>
    {
        return(
            <tr key={loc.id}>
                <td >{loc.id}</td>
                <td >{loc.details}</td>
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

    componentDidMount() {
        this.fetchLocations();
        this.fetchCourts();
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


    render() {
        return (
            <div style={{maxHeight:750, height:750}}>
                <h1 style={{textAlign: "center",color:"black"}}>Home Page</h1>
                <h2 style={{textAlign: "left",color:"black"}}>Description</h2>
                <p style={{textAlign: "left",color:"black"}}>
                    Pe pagina de Client puteti sa va faceti o rezervare , la un teren de tenis :
                    <ul>
                        <li>Selectati din dropdown data de inceput si data finala</li>
                        <li>Putem afisa toate court-urile disponibile la aceea ora.</li>
                        <li>Selectam din dropdown locatia</li>
                        <li>Se va deschide dropdown-ul pentru selectia court-urilor,alegem si aici una</li>
                        <li>Pe urma putem adauga o rezervare</li>
                    </ul>
                </p>
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

            </div>
        );
    }
}

export default HomeComponent