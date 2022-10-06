import React from "react";
import Table from "../../commons/tables/table";
import * as API_SENSORS from "../api/sensor-api";
import SensorEditForm from "./sensorEdit-form";
//import styles from "../../commons/styles/butoane.css";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

const columns = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'SensorDescription',
        accessor: 'sensorDescription',
    },
    {
        Header: 'MaximumValue',
        accessor: 'maximumValue',
    },
    {
        id: 'deviceId',
        Header: 'deviceId',
        accessor: x=>x.deviceDTO.id.toString(),
    }

];

const filters = [
    {
        accessor: 'sensor',
    }
];

class SensorTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
        this.toggleForm=this.toggleForm.bind(this);
        this.reload=this.props.reload;
        this.reloadHandler=this.props.reloadHandler;
    }
    toggleForm(row) {
        if (!this.state.selected) {
            this.sensor = row.original
        }
        this.setState({selected: !this.state.selected});
    }
    delete(id) {
        return API_SENSORS.deleteSensor(id, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully deleted sensor with id: " + result);
                this.reload();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }
    render() {
        if(columns.find(param => param.id==="Edit" )) { columns.pop();columns.pop(); }
        columns.push(
            {
                id: "Edit",
                Header: "EditRow",
                Cell: (row) => ( 
                     <Button color="primary" onClick={() =>this.toggleForm(row)}>Edit</Button> 
                )
            })
        columns.push(
            {
                id: "Delete",
                Header: "DeleteRow",
                Cell: (row) => ( 
                     <Button className="btn-danger" onClick={() =>this.delete(row.original.id)}>Delete</Button> 
                )
            })
        return (
            <div>
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
            <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm}> Edit Sensor: </ModalHeader>
                    <ModalBody>
                        <SensorEditForm reloadHandler={this.reload} sensor={this.sensor}/>
                    </ModalBody>
            </Modal>
            </div>
        )
    }
}

export default SensorTable;