import React from 'react';
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import * as ReactBootstrap from 'react-bootstrap'


class LoadingModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded : this.props.loaded
        };
    }

    render() {
        return (
            <div>
                {this.state.loaded === true ? null :
                    <ReactBootstrap.Spinner animation="border" style={{left: '50%',position: 'absolute'}}/>
                }
            </div>

        ) ;
    }
}

export default LoadingModal;
