const fs = require('fs');

class functions {

    // update users signup file
    updateUsers(data) {
        var res = {
            status: "fail",
            reason: "unknown"
        }
        const [username, email, password] = [
            data.body.username,
            data.body.email,
            data.body.password,
        ]
        var data = fs.readFileSync('./database/users.json', 'utf-8');

        // Handle file error
        try {
            data = JSON.parse(data);
        } catch (e) {
            fs.writeFileSync('./database/usersbackup.json', data);
            fs.writeFileSync('./database/users.json', "{}");
        }

        if (!(email in data) && email !== "" && username !== "" & password !== "") {
            data[email] = [username, password];
            fs.writeFileSync('./database/users.json', JSON.stringify(data, null, 4))
            res.status = "success";
        }
        else {
            res.status = "fail";
            res.reason = "This email is already registered with us";
        }
        return res;
    }

    // VALIDATE LOGIN CREDENTIALS
    isLoginValid(login) {
        console.log(login);
        var res = {};
        const email = login.email;
        const password = login.password;
        const rememberme = login.rememberme;
        const ip = login.ip;

        var data = fs.readFileSync('./database/users.json', 'utf-8');
        data = JSON.parse(data);
        if (email in data && data[email][1] === password) {
            res.isvalid = true;

            if (rememberme === 'true') {
                var data = fs.readFileSync('./database/sessiondata.json', 'utf-8');
                data = JSON.parse(data);
                const cookie = ip;
                if (!(data.includes(cookie))) {
                    data.push(cookie);
                    fs.writeFileSync('./database/sessiondata.json', JSON.stringify(data, null, 4));
                    res.keeplogged = true;
                }
            }
        }
        else {
            res.isvalid = false;
        }
        return res;
    }


    // CHECK THE USER IP ADDRESS FOR REDIRECT TO LOGGED IN STATE
    checkCookieForRedirect(login) {
        var redirect = false;
        var storedIps = fs.readFileSync('./database/sessiondata.json');
        storedIps = JSON.parse(storedIps);
        if (login.loginstate && storedIps.includes(login.ip)) {
            redirect = true;
        }
        return redirect;
    }

    // GET EVENTS
    getEvents(user) {
        var events = fs.readFileSync('./database/events.json', 'utf-8');
        events = JSON.parse(events);
        return (events[user.email]);
    }

    // ADD A NEW EVENT
    pushEvent(eventdata) {
        var data = fs.readFileSync('./database/events.json', 'utf-8');
        data = JSON.parse(data);
        const newdata = {
            eventname: eventdata.eventname,
            eventtype: eventdata.eventtype,
            eventdate: eventdata.eventdate,
            eventtime: eventdata.eventtime,
            eventnote: eventdata.eventnote
        }
        console.log(eventdata);
        data[eventdata.email].push(newdata);

        fs.writeFileSync('./database/events.json', JSON.stringify(data, null, 4));
    }
}
module.exports = new functions;

