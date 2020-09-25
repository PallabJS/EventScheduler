import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import Select
import { post, get } from 'jquery';

import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

export default function Events({ cookieToObject }) {

    let history = useHistory();
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    let [events, setEvents] = useState([]);

    // REDIRECT TO LOGIN IF LOGIN STATE IF FALSE
    if (document.cookie === "") {
        history.push('/login');
    }

    // ONE EVENT VIEW
    const [showEvent, setShowEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();

    // MODAL FORM STATES
    var dates = [];
    const [eventname, setEventname] = useState('');
    const [eventtype, setEventtype] = useState('meeting');
    const [eventdate, setEventdate] = useState();
    const [eventtime, setEventtime] = useState();
    const [eventnote, setEventnote] = useState('');

    const [eventCreated, SetEventCreated] = useState(false);

    // RESET MODAL STATES
    function resetState() {
        setEventname('');
        setEventtype('');
        setEventdate('');
        setEventtime('');
        setEventnote('');
    }


    // Display create event modal
    function showModal() {
        setShowCreateEventModal(true);
    }
    function closeModal() {
        setShowCreateEventModal(false);
    }

    useEffect(() => {

        // GET EVENTS LIST
        get("http://localhost:8000/events", cookieToObject(document.cookie),
            function (data, textStatus, jqXHR) {
                if (data) {
                    data.forEach((value, index, array) => {
                        data[index].id = index + 1;
                    })
                    setEvents(data);
                }
            }
        );
    }, [cookieToObject]);

    // // CREATE A NEW EVENT
    function createEvent() {
        SetEventCreated(false);
        const eventdata = {
            email: cookieToObject(document.cookie).email,
            eventname: eventname,
            eventtype: eventtype,
            eventdate: eventdate,
            eventtime: eventtime,
            eventnote: eventnote
        }
        post("http://localhost:8000/addevent", eventdata,
            function (status, textStatus, jqXHR) {
                if (status === "success") {
                    console.log("success event creation");
                    resetState();
                    SetEventCreated(true);

                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                }
            }
        );
    }

    // VIEW EVENT
    function viewEvent(e) {
        if (dates.includes(e.toLocaleDateString())) {
            setShowEvent(true);
            var itemindex = dates.indexOf(e.toLocaleDateString());
            setSelectedEvent(events[itemindex]);
        }
        else {
            setShowEvent(false);
        }
    }

    // LOGOUT
    function logOut() {
        var cookie = cookieToObject(document.cookie);
        document.cookie = "email=" + cookie.email + ";max-age=" + 0;
        document.cookie = "loginstate=" + cookie.loginstate + ";max-age=" + 0;
        history.push('/login');
    }


    return (
        <React.Fragment>
            <Header></Header>

            <Modal show={showCreateEventModal} onHide={() => { }}>
                <Modal.Header>
                    <Modal.Title> Create New Event </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        eventCreated ? <h3 className="a_note_green font_large"> Event Created </h3> :
                            <div id="modal_content">
                                <div className="fullbox_flex">

                                    <input
                                        id="eventname"
                                        className="flave_forminput"
                                        style={{ flex: '2' }}
                                        placeholder="Event Name"
                                        type='text'
                                        onChange={(e) => { setEventname(e.target.value) }}
                                    />

                                    <select className="flave_forminput" style={{ flex: '1' }} value={eventtype} onChange={(e) => { setEventtype(e.target.value) }}>
                                        <option value="meeting"> Meeting </option>
                                        <option value="interview"> Interview </option>
                                        <option value="groupdiscussion"> Group Discussion </option>
                                    </select>
                                </div>
                                <div className="fullbox_flex">
                                    <span className="lead" style={{ flex: '1' }}> Select a date </span>
                                    <input
                                        id="eventname"
                                        className="flave_forminput"
                                        style={{ flex: '1' }}
                                        placeholder="Set Event Date"
                                        type='date'
                                        onChange={(e) => {
                                            setEventdate(e.target.value)
                                        }}
                                    />
                                    <input
                                        id="eventname"
                                        className="flave_forminput"
                                        style={{ flex: '1' }}
                                        placeholder="Set Event Date"
                                        type='time'
                                        onChange={(e) => {
                                            setEventtime(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="fullbox_flex">
                                    <textarea
                                        id="eventnote"
                                        value={eventnote}
                                        placeholder="Add a note (Optional)"
                                        className="flave_forminput"
                                        rows='5'
                                        style={{ resize: 'none' }}
                                        onChange={(e) => { setEventnote(e.target.value) }}></textarea>
                                </div>

                            </div>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createEvent}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal >



            <div className="fullbox_flex">

                <div className="calender_container center_contents">
                    <div className="fullbox text_left">
                        <Button className="font_normal btn-info" onClick={logOut}> Logout </Button>
                    </div>
                    <Calendar
                        className="calender"
                        tileContent={""}
                        tileClassName={(date, view) => {

                            dates = events.map((value, index, array) => {
                                return ((new Date(value.eventdate)).toLocaleDateString());
                            })

                            if (date.date.toLocaleDateString() === (new Date()).toLocaleDateString()) {
                                return 'todaytile';
                            }
                            else if (dates.includes(date.date.toLocaleDateString())) {
                                return "eventshighlight datetile";
                            }
                            else {
                                return "datetile"
                            }
                        }}
                        onChange={(e) => { viewEvent(e) }}
                    />
                    <br />
                    <input
                        type="button"
                        value="Create a new event"
                        id="create_event"
                        className="title_text flave_button"
                        onClick={showModal}
                    />
                </div>

                <div className="eventslist">
                    <h3 className="title_text"> Your Upcoming Events </h3>
                    <hr />
                    {
                        events.map((event) => {
                            return (
                                <React.Fragment key={event.id}>
                                    <div className="event_container" key={event.id}>
                                        <h4 className="title_text font_normal" style={{ backgroundColor: 'white', textAlign: 'left', padding: '2px 10px' }}>
                                            <b style={{ color: 'var(--black)', fontSize: '10pt' }}> {event.eventtype.toUpperCase()} </b>
                                        </h4>

                                        <span style={{ color: "white", fontSize: '14pt' }}> &nbsp; - {event.eventname} </span>
                                        <br />
                                        <span style={{ color: "var(--black)", fontSize: '12pt' }}> Date: </span>
                                        <b style={{ color: "var(--black)", fontSize: '12pt' }}> {event.eventdate} at {event.eventtime} </b>
                                    </div>
                                    <hr />
                                </React.Fragment>
                            )
                        })
                    }
                </div>

                <div className="eventscontent">
                    <h3 className="flave_header2"> Event Description </h3>
                    <hr />
                    {
                        showEvent ?
                            <React.Fragment>
                                <div id="show_event" style={{ lineHeight: '30pt' }}>
                                    <h4 className="title_text font_normal" style={{ backgroundColor: 'white', textAlign: 'left', padding: '2px 10px' }}>
                                        <b style={{ color: 'var(--black)', fontSize: '20pt' }}> #{selectedEvent.eventtype.toUpperCase()} </b>
                                    </h4>

                                    <span style={{ color: "black", fontSize: '16pt' }}> &nbsp; - {selectedEvent.eventname} </span>
                                    <br />
                                    <span style={{ color: "var(--black)", fontSize: '14pt' }}> Date: </span>
                                    <b style={{ color: "var(--black)", fontSize: '14pt' }}> {selectedEvent.eventdate} at {selectedEvent.eventtime} </b>
                                    <p className="lead font_normal"> Note: {selectedEvent.eventnote} </p>
                                </div>
                                <hr />
                            </React.Fragment>
                            :
                            <div>
                                <h4 className="flave_title"> Click on an Upcoming Event to display full details </h4>
                            </div>
                    }
                </div>

            </div>
        </React.Fragment >
    )
}