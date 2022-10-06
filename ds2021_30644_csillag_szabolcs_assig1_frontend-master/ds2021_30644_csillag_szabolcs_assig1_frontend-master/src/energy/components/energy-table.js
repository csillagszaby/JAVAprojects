import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'LocalDateTime',
        accessor: 'localDateTime',
    },
    {
        Header: 'Value',
        accessor: 'value',
    },
    {
        id: 'sensorId',
        Header: 'sensorId',
        accessor: x=>x.sensorDTO.id.toString(),
    }

];

const filters = [
    {
        accessor: 'energy',
    }
];

class EnergyTable extends React.Component {

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

export default EnergyTable;