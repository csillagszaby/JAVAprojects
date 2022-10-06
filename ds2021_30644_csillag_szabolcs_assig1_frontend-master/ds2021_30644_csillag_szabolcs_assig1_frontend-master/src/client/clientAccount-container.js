import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import ClientAccountForm from "./components/clientAccount-form";


import * as API_USERS from "./api/clientAccount-api";
import {BrowserRouter as Redirect} from 'react-router-dom';
import ClientAccountTable from "./components/clientAccount-table";
import { withRouter } from 'react-router';



class ClientContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.reload2 = this.reload2.bind(this);
        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null
        };
    }

    componentDidMount() {
        this.reload();
        this.fetchClients();
    }

    fetchClients() {
        return API_USERS.getClients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchClients();
    }

    reload2() {
        this.setState({
            isLoaded: false,
            selected:false,
        });
        this.fetchClients();
    }



    render() {
        let type = sessionStorage.getItem('type');
        return (
            <div>
                {() => type==="admin"?<div/>:<Redirect to='/client'/>}
                <CardHeader>
                    <strong> Client Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.toggleForm}>Add Client </Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoaded && <ClientAccountTable tableData = {this.state.tableData} reload ={this.reload2}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm}> Add clientAccount: </ModalHeader>
                    <ModalBody>
                        <ClientAccountForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

                

                

            </div>
        )

    }
}


export default withRouter(ClientContainer);
