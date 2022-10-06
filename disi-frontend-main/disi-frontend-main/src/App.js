import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login/login.component";
import SignUp from "./components/signup/signup.component";
import AdminComponent from "./components/admin/admin.component";
import ClientComponent from "./components/client/client.component";
import HomeComponent from "./components/home/home.component";
import ResetPasswordComponent from "./components/resetPassword.component";
import background from "./images/tenis2.jpg";
import {Label} from "reactstrap";
import GenerateCodeComponent from "./components/generateCode.component";
function App() {

    return (<Router>
            <div className="App" style={{
                /*backgroundImage: `url(${background})`,*/
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%'
            }}>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="collapse navbar-collapse justify-content-end" id="navbarToggler">
                        <ul className="navbar-nav mr-auto">
                            {window.sessionStorage.getItem("loggedIn") === 'true' ?
                                (<Label className="nav-user" style={{fontWeight: "bold"}}>Logged in as:  {window.sessionStorage.getItem('name')}</Label>)
                                :
                                (<li className="nav-item">
                                <Link className="nav-link" style={{color:'white'}} to={"/login"}>Login</Link>
                                </li>)

                            }
                            {window.sessionStorage.getItem("loggedIn") === 'true' ?
                                (
                                    <li className="nav-item">
                                        <Link className="nav-link" onClick={() => {
                                            {window.sessionStorage.clear();
                                                window.localStorage.clear();
                                                window.location.href='/home';
                                            }
                                        }} style={{color:'white'}} to={"/home" }>Log Out</Link>
                                    </li>
                                ) :
                                (<li className="nav-item">
                                    <Link className="nav-link" style={{color:'white'}} to={"/sign-up"}>Sign up</Link>
                                </li>)

                            }
                            {window.sessionStorage.getItem("isAdmin") === 'true' ?
                                (<li className="nav-item">
                                    <Link className="nav-link" style={{color:'white'}} to={"/admin"}>Admin</Link>
                                </li>) :
                                null
                            }
                            {window.sessionStorage.getItem("loggedIn") === 'true' ?
                                (<li className="nav-item">
                                <Link className="nav-link" style={{color:'white'}} to={"/client"}>Client</Link>
                            </li>) : null}
                            <li className="nav-item">
                                <Link className="nav-link" style={{color:'white'}} to={"/home"}>Home</Link>
                            </li>
                        </ul>
                    </div>

                </nav>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <Routes>
                            <Route exact path='/' element={<HomeComponent/>} />
                            <Route path="/home" element={<HomeComponent/>} />
                            <Route path="/login" element={<Login/>} />
                            <Route path="/sign-up" element={<SignUp/>} />
                            <Route path="/client" element={<ClientComponent/>} />
                            <Route path="/admin" element={<AdminComponent/>} />
                            <Route path="/resetPassword" element={<ResetPasswordComponent/>} />
                            <Route path="/generateCode" element={<GenerateCodeComponent/>} />
                        </Routes>
                    </div>
                </div>
            </div></Router>
    );
}
export default App;
