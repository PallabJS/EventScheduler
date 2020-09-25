import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { post, get } from 'jquery';

import Header from '../components/Header';

export default function LoginPage({ justSignedup, setJustSignedUp, cookieToObject }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberme, setRememberme] = useState(false);
    const [ip, setIp] = useState();
    const [loginError, setLoginError] = useState(false);

    // REDIRECTOR
    let history = useHistory();

    // GET USER IP ADDRSS
    get('https://api.ipify.org?format=json', (data) => {
        setIp(data.ip);
    });

    // RUN ON RENDER
    useEffect(() => {

        // LOGIN STATE CHECK
        const login = {
            email: cookieToObject(document.cookie).email,
            loginstate: cookieToObject(document.cookie).loginstate,
            ip: ip
        }
        post('http://localhost:8000/autologin', login,
            function (res) {
                if (res) {
                    history.push('/events');
                }
            }
        )
    });

    // LOGIN REQUEST
    function loginHandler(e) {
        e.preventDefault();
        const logindata = {
            email: email,
            password: password,
            rememberme: rememberme,
            ip: ip
        }
        post('http://localhost:8000/login', logindata,
            function (res) {
                if (res.isvalid === true) {
                    setLoginError(false);
                    if (res.keeplogged) {
                        var d = new Date(2050, 0, 0);
                        d = d.toUTCString();
                        document.cookie = "loginstate=" + res.keeplogged + "; expires=" + d;
                        document.cookie = "email=" + email + "; expires=" + d;
                    }
                    else {
                        document.cookie = "loginstate=" + res.keeplogged;
                        document.cookie = "email=" + email;
                    }
                    history.push('/events');
                }
                else {
                    setLoginError(true);
                }
            }
        )
    }

    return (
        <React.Fragment>
            <Header></Header>

            <div className="fullbox_flex_compact">
                <div className="fullbox" style={{ flex: 2 }}>
                    Other Contents
                </div>

                <div style={{ flex: 1 }}>

                    <div>
                        {(justSignedup ?
                            <p className="a_note_green"> You have just signed up </p> : "")}
                    </div>

                    <div>
                        {(loginError ?
                            <p className="a_note_red"> Please check your username and password </p> : "")}
                    </div>


                    <form action="" className="flave_form">
                        <h5 className="flave_header3"> Login to your account </h5>
                        <div className="flave_inputgroup">
                            <label> Email: </label>
                            <input
                                id="email"
                                type="text"
                                className="flave_forminput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flave_inputgroup">
                            <label> Password: </label>
                            <input
                                id="password"
                                type="password"
                                className="flave_forminput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flave_inputgroup center_contents" style={{ flexDirection: "row", alignItems: "center" }}>
                            <div style={{ flex: 1, textAlign: "center" }} className="lead"> Remember me </div>
                            <input
                                style={{ flex: 1, textAlign: "center" }}
                                type="checkbox"
                                checked={rememberme}
                                onChange={(e) => { setRememberme(!rememberme) }}
                            />
                        </div>
                        <div className="flave_inputgroup center_contents">
                            <input
                                onClick={(e) => { loginHandler(e) }}
                                type="submit"
                                className=" flave_button"
                                value="Login" />
                        </div>
                    </form>

                </div>
            </div>
        </React.Fragment>
    )
}