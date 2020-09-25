import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import './stylesheets/flave.css';

import HomePage from '../src/pages/HomePage';
import SignupPage from '../src/pages/SignupPage';
import LoginPage from '../src/pages/LoginPage';
import Events from '../src/pages/Events';

export default function App() {

    let [justSignedup, setJustSignedUp] = useState();

    // COOKIE TO OBJECT CONVERTER
    function cookieToObject(cookie) {
        var itemsArray = cookie.split(";")
        for (let i = 0; i < itemsArray.length; i++) {
            itemsArray[i] = itemsArray[i].trim();
        }
        var cookieObject = {}
        for (let i = 0; i < itemsArray.length; i++) {
            cookieObject[itemsArray[i].split("=")[0]] = itemsArray[i].split("=")[1];
        }
        return cookieObject;
    }

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <LoginPage
                        justSignedup={justSignedup}
                        setJustSignedUp={setJustSignedUp}
                        cookieToObject={cookieToObject}
                    />
                </Route>
                <Route path="/signup">
                    <SignupPage
                        justSignedup={justSignedup}
                        setJustSignedUp={setJustSignedUp}
                    />
                </Route>
                <Route path="/events">
                    <Events
                        cookieToObject={cookieToObject}
                    />
                </Route>
                <Route exact path="/">
                    <HomePage />
                </Route>
            </Switch>
        </Router>
    )
}