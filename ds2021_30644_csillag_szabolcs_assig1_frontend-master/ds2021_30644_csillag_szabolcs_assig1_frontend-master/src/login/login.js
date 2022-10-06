import React from 'react';
import {Form, Header, Message} from 'semantic-ui-react';
import store from 'store';
import * as API_ACCOUNT from './login-api';
import { withRouter } from 'react-router';

class Login extends React.Component { 
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            error: false,
        };
        this.clientAccount = null;

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const {name, password} = this.state;
        this.setState({error: false});
        this.getClientAccount(name,password);
        store.set('loggedIn', true);

    }

    handleChange(e, {name, value}) {
        this.setState({[name]: value});
    }
    functiepush() {
        this.props.history.push("/client");
    }
    getClientAccount(name,password) {
        return API_ACCOUNT.getClientAccountByName(name, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.clientAccount = result;
                if(this.clientAccount.password===password) {
                    sessionStorage.setItem('name', this.clientAccount.name);
                    sessionStorage.setItem('id', this.clientAccount.id);
                    sessionStorage.setItem('loggedIn',"Yes");
                    if (this.clientAccount.isAdmin === "yes" ) {
                        sessionStorage.setItem('type', "admin");
                    }
                    else {
                        sessionStorage.setItem('type', "client");
                    }
                    this.functiepush();
                }
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    render() {
        const {error} = this.state;

        return (
            <div>
                    <Form  error={error} onSubmit={this.onSubmit}>
                        <Header as="h1">Login</Header>
                        {error && <Message
                            error={error}
                            content="That name/password is incorrect. Try again!"
                        />}
                        <Form.Input
                            inline
                            label="Name"
                            name="name"
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            inline
                            label="Password"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <Form.Button type="submit">Login</Form.Button>
                    </Form>
            </div>
        );
    }
}

export default withRouter(Login);
