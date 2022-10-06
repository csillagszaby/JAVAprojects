import React from "react";
import Table from "../../commons/tables/table";
import * as API_DEVICES from "../api/device-api";
import DeviceEditForm from "./deviceEdit-form";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';


let columns = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'Max',
        accessor: 'maxEnergyConsumption',
    },
    {
        Header: 'Average',
        accessor: 'averageEnergyConsumption',
    },
    {
        Header: 'clientName',
        accessor: 'clientAccountDTO.name',
    }

];

const filters = [
    {
        accessor: 'device',
    }
];

class DeviceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
        this.toggleForm=this.toggleForm.bind(this);
        this.reload=this.props.reload;
        this.reloadHandler = this.props.reloadHandler;
    }

    toggleForm(row) {
        if (!this.state.selected) {
            this.device = row.original
        }
        this.setState({selected: !this.state.selected});
    }
    delete(id) {
        return API_DEVICES.deleteDevice(id, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully deleted device with id: " + result);
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
                    <ModalHeader toggle={this.toggleForm}> Edit Device: </ModalHeader>
                    <ModalBody>
                        <DeviceEditForm reloadHandler={this.reload} device={this.device}/>
                    </ModalBody>
            </Modal>
            </div>
        )
    }
}

export default DeviceTable;