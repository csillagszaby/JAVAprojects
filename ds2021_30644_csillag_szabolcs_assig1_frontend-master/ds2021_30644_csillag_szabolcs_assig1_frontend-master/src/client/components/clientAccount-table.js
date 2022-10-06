import React from "react";
import Table from "../../commons/tables/table";
import ClientAccountEditForm from "./clientAccountEdit-form";
import * as API_USERS from "../api/clientAccount-api";
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
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'BirthDate',
        accessor: 'birthdate',
    },
    {
        id: 'isAdmin',
        Header: 'IsAdmin',
        accessor: a=>a.isAdmin==="yes"?"Admin":"Client",
    },
    {
        Header: 'Password',
        accessor: 'password',
    }

];

const filters = [
    {
        accessor: 'clients',
    }
];

class ClientAccountTable extends React.Component {

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
            this.user = row.original
        }
        this.setState({selected: !this.state.selected});
    }
    delete(id) {
        return API_USERS.deleteClient(id, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully deleted client with id: " + result);
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
                    <ModalHeader toggle={this.toggleForm}> Edit ClientAccount: </ModalHeader>
                    <ModalBody>
                        <ClientAccountEditForm reloadHandler={this.reload} user={this.user}/>
                    </ModalBody>
            </Modal>
            </div> 
        )

    }
}

export default ClientAccountTable;