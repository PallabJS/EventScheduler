import React from 'react';
import Header from '../components/Header';
import { useHistory } from 'react-router-dom';

import '../stylesheets/homepage.css';

export default function HomePage() {
    let history = useHistory();

    return (
        <React.Fragment>
            <Header></Header>
            <div className="fullbox_flex_compact">
                <p className="font_normal text_justify" style={{ width: '100%' }}>
                    Manage your events by using our free <b> Event Scheduller App</b>.
                </p>
            </div>
            <br />
            <div className="homepage_buttons">
                <input className="flave_button" type="button" value="Login"
                    onClick={() => { history.push('/login') }}
                />
                <input className="flave_button" type="button" value="Sign Up"
                    onClick={() => { history.push('/signup') }}
                />
            </div>
        </React.Fragment>
    )
}