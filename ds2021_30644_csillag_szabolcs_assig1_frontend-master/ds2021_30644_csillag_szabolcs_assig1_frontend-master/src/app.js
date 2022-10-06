import React from 'react'
import {BrowserRouter as Router, Route, Switch,Redirect} from 'react-router-dom'
import NavigationBar from './navigation-bar'
//import Home from './home/home';
import ClientContainer from './client/clientAccount-container'
import DeviceContainer from './device/device-container'
import SensorContainer from './sensor/sensor-container'
import EnergyContainer from './energy/energy-container'
import ClientViewContainer from './clientView/clientViewContainer'
import Login from "./login/login";
import 'semantic-ui-css/semantic.min.css'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';

class App extends React.Component {


    render() {
        let type = sessionStorage.getItem('type');
        return (
            <div className={styles.back}>
            <Router>
                <div>
                    {type==="admin" &&  <NavigationBar /> }
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Login/>}
                        />

                        <Route
                            exact
                            path='/client'
                            render={() => type==="admin"?<ClientContainer/>:<ClientViewContainer/>}
                        />
                        <Route
                            exact
                            path='/device'
                            render={() => type==="admin"?<DeviceContainer/>:<Redirect to='/client'/>}
                        />
                        <Route
                            exact
                            path='/sensor'
                            render={() => type==="admin"?<SensorContainer/>:<Redirect to='/client'/>}
                        />
                        <Route
                            exact
                            path='/energy'
                            render={() => type==="admin"?<EnergyContainer/>:<Redirect to='/client'/>}
                        />
                        

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />
                        


                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
