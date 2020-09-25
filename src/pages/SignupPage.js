
import React, { useState } from 'react';
import { post } from 'jquery';
import { useHistory } from 'react-router-dom';


import Header from '../components/Header';

const SignupPage = ({ justSignedup, setJustSignedUp }) => {

    // Redirector
    let history = useHistory();

    // State for email and username
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // My Variables
    var showing = false;

    // Email already used flag
    const [alreadySignedup, setAlreadySignedup] = useState(false);

    // Not sufficeint data entered
    const [isFormFilled, setIsFormFilled] = useState(true);

    // Update values
    function update(name, e) {
        if (name === "username") {
            setUsername(e.target.value);
        }
        if (name === "email") {
            setEmail(e.target.value);
        }
        if (name === "password") {
            setPassword(e.target.value);
        }
        if (username !== "" && email !== "" && password !== "") {
            setIsFormFilled(true);
        }
    }

    // Signup Request Handler
    const signupRequest = (e) => {
        e.preventDefault();

        const data = {
            username: username,
            email: email,
            password: password
        }

        if (username !== "" && email !== "" && password !== "") {
            post("http://localhost:8000/signup", data,
                function (res, textStatus, status) {
                    console.log(res);
                    if (res.status === 'success') {
                        setEmail("");
                        setPassword("");
                        setUsername("");
                        setJustSignedUp(true);
                        history.push('/login');
                    } else if (res.status === 'fail') {
                        setAlreadySignedup(true);
                    }
                }
            );
            if (!showing) {
                showing = true;
                setTimeout(() => {
                    setAlreadySignedup(false);
                    showing = false;
                }, 5000)
            }
        }
        else {
            setIsFormFilled(false);
        }
    }
    // Refirect to login page
    const redirectLogin = () => {
        history.push("/login");
    }

    return (
        <React.Fragment>
            <Header></Header>

            <div className="fullbox_flex_compact">
                <div style={{ flex: 2 }}></div>
                <div style={{ flex: 1 }}>
                    <div>
                        {(alreadySignedup ?
                            <div className="fullbox" style={{ textAlign: "center" }}>
                                <span className="a_note_red">Email is already registered, Try logging in </span>
                                <input className="flave_button" type="button" value="login" onClick={() => redirectLogin()} />
                            </div> : "")}
                    </div>
                    <div>
                        {(!isFormFilled ?
                            <div className="fullbox" style={{ textAlign: "center" }}>
                                <span className="a_note_red"> Fill all the fields </span>
                            </div> : "")}
                    </div>
                    <form id="signup" action="" className="flave_form">
                        <h5 className="flave_header3"> Signup for a new account </h5>
                        <div className="flave_inputgroup">
                            <label> Username </label>
                            <input
                                name="username"
                                type="text"
                                value={username}
                                className="flave_forminput"
                                onChange={(e) => update("username", e)}
                                required />
                        </div>
                        <div className="flave_inputgroup">
                            <label> Email Address </label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                className="flave_forminput"
                                onChange={(e) => update("email", e)}
                                required />
                        </div>
                        <div className="flave_inputgroup">
                            <label> Password </label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                className="flave_forminput"
                                onChange={(e) => update("password", e)}
                                required />
                        </div>
                        <div className="flave_inputgroup center_contents">
                            <input type="submit" className=" flave_button" value="Signup" onClick={(e) => signupRequest(e)} />
                        </div>
                    </form >

                </div>
            </div>
        </React.Fragment>
    )
}

export default SignupPage;