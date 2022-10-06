import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table} from "reactstrap";
import axios from "axios";
import {HOST} from "../../hosts";

class SeeAllCourtsAvailableForm extends React.Component {
    constructor(props) {
        super(props);
        this.startDate=this.props.startDate;
        this.endDate=this.props.endDate;
        this.state = {
            courtsAvailable: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //
    // handleChangeStartDate(date) {
    //     this.setState({
    //         startDate: date
    //     })
    // }
    //
    // handleChangeEndDate(date) {
    //     this.setState({
    //         endDate: date
    //     })
    // }

    handleSubmit() {
        const body = {
            "startTime": this.startDate,
            "endTime": this.endDate,
        };
        console.log(body);
        axios.post(HOST.backend_api + '/court/getAvailableCourts', body, {
            headers: {
                "Authorization": `${localStorage.getItem('jwt')}`,
                "Access-Control-Allow-Origin": "*"
            }
        }).then((res) => {
            console.log(res.data);
            this.setState({
                courtsAvailable: res.data
            });
            console.log(this.state.courtsAvailable);
        }).catch(err => console.log(err))
    }

    renderCourtsAvailable = (court) => {
        return (
            <tr key={court.id}>
                <td>{court.id}</td>
                <td colSpan={3}>{court.number}</td>
                <td colSpan={3}>{court.location.details}</td>
            </tr>
        )
    }
    componentDidMount() {
        this.handleSubmit();
    }

    render() {
        return (
            <div>
                {/*<form>*/}
                {/*    <div className="form-group">*/}
                {/*        <Label style={{fontWeight: "bold"}}>Start Date: </Label>*/}
                {/*        <DatePicker*/}
                {/*            selected={this.state.startDate}*/}
                {/*            onChange={this.handleChangeStartDate}*/}
                {/*            showTimeSelect*/}
                {/*            timeFormat="HH"*/}
                {/*            timeIntervals={20}*/}
                {/*            timeCaption="time"*/}
                {/*            dateFormat="MMMM d, yyyy h"*/}
                {/*            minDate={new Date()}*/}
                {/*            maxDate={addDays(new Date(), 7)}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="form-group">*/}
                {/*        <Label style={{fontWeight: "bold"}}>End Date: </Label>*/}
                {/*        <DatePicker*/}
                {/*            selected={this.state.endDate}*/}
                {/*            onChange={this.handleChangeEndDate}*/}
                {/*            showTimeSelect*/}
                {/*            timeFormat="HH"*/}
                {/*            timeIntervals={20}*/}
                {/*            timeCaption="time"*/}
                {/*            dateFormat="MMMM d, yyyy h"*/}
                {/*            minDate={new Date()}*/}
                {/*            maxDate={addDays(new Date(), 7)}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</form>*/}
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <Button type={"submit"} onClick={this.handleClose}> Close </Button>*/}
                {/*    </Col>*/}
                {/*    <Col style={{textAlign: "right"}}>*/}
                {/*        <Button type={"submit"} onClick={this.handleSubmit}> See Courts Available </Button>*/}
                {/*    </Col>*/}

                {/*</Row>*/}
                <Table striped bordered hover>
                    {//console.log("afisez2")
                    }
                    <thead>
                    <tr>
                        <th>#</th>
                        <th style={{textAlign: "center"}}>NumberCourt</th>
                        <th style={{textAlign: "center"}}>LocationDetails</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state. courtsAvailable!==null ? this.state.courtsAvailable.map((court, index) => {
                        const {id, number, location} = court
                        return (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{number}</td>
                                <td>{location.details}</td>
                            </tr>
                        )
                    }):null}
                    {//this.state.courtsAvailable.map(this.renderCourtsAvailable)}
                    }
                    {//this.state.courtsAvailable!==null ? this.state.courts.map(this.renderCourtsAvailable):null
                    }
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default SeeAllCourtsAvailableForm;