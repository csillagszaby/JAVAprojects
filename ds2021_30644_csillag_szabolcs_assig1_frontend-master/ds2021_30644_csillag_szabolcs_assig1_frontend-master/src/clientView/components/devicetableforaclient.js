import React from "react";
import Table from "../../commons/tables/table";


const columns = [
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
    }

];

const filters = [
    {
        accessor: 'devices',
    }
];

class DeviceTableForAClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <div>
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
            </div>
        )
    }
}

export default DeviceTableForAClient;