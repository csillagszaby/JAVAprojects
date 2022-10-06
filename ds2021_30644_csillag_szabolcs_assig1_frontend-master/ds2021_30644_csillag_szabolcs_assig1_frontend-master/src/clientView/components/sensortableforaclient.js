import React from "react";
import Table from "../../commons/tables/table";

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

class SensorTableForAClient extends React.Component {

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
                pageSize={10}
            />
            </div>
        )
    }
}

export default SensorTableForAClient;