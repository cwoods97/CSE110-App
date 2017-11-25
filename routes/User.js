var express = require('express');
var router = express.Router();

router.get('/joinedSessions', (req, res) => {
    const uid = req.locals.uid;
    const admin = req.locals.admin;

    admin.database().ref("users").child(uid + '/' + 'joinedSessions')
    .then((dataSnapshot) => {
        sessionKeys = Object.keys(dataSnapshot);
        res.sendStatus(200).end(sessionKeys);
    }).catch((error) => {
        res.sendStatus(404).end(error);
    })
})

router.get('/hostedSessions', (req, res) => {
    const uid = req.locals.uid;
    const admin = req.locals.admin;

    admin.database().ref("users").child(uid + '/' + 'hostedSessions')
    .then((dataSnapshot) => {
        sessionKeys = Object.keys(dataSnapshot);
        res.sendStatus(200).end(sessionKeys);
    }).catch((error) => {
        res.sendStatus(404).end();
    })
})

module.exports = router;
