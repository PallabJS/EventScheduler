console.clear();

// Imports
const http = require('http');
const express = require('express');
const fn = require('./functions.js');
const bp = require('body-parser');


// Apps
const app = express();

// app.use(bp());
app.use(bp.json()); // to support JSON-encoded bodies
app.use(bp.urlencoded({ extended: false }));
app.enable('trust proxy');


// Handle Requests
// SIGNUP
app.post('/signup', (req, res) => {
    var status = fn.updateUsers(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(status);
    res.end();
})

// HANDLE FIRST TIME LOGIN
app.post('/login', (req, res) => {
    console.log("login req");
    res.header("Access-Control-Allow-Origin", "*");
    const status = fn.isLoginValid(req.body);
    console.log(status);
    res.send(status);
    res.end();
})

// HANDLE AUTO LOGIN BY CHECKING COOKIE SET TO TRUE AND MATCHING USER IP
app.post('/autologin', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.body.loginstate && req.body.ip) {
        var status = fn.checkCookieForRedirect(req.body);
        res.send(status);
    }
    res.end();
})
// FETCH EVENTS LIST
app.get('/events', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("request for: " + JSON.stringify(req.query));
    const data = fn.getEvents(req.query);
    res.send(data);
    res.end();
})

// ADD A NEW EVENT
app.post('/addevent', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    fn.pushEvent(req.body);
    res.send("success");
    res.end();
})









app.listen(8000, () => {
    console.log("Server running at 8000");
})
