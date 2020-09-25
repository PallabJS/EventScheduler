import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Header() {

    let history = useHistory();

    return <h1
        className="flave_header1"
        onClick={() => { history.push('/') }}
    > Event Scheduler </h1>
}