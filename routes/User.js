var express = require('express');
var router = express.Router();

router.get('/joinedSessions', (req, res) => {
    const uid = req.locals.uid;
    const admin = req.locals.admin;

    admin.database().ref("users").child(uid + '/' + 'joinedSessions')
    .then((dataSnapshot) => {
        sessionKeys = Object.keys(dataSnapshot);
        res.status(200).json(sessionKeys);
    }).catch((error) => {
        res.status(404).json(error);
    })
})

router.get('/hostedSessions', (req, res) => {
    const uid = req.locals.uid;
    const admin = req.locals.admin;

    admin.database().ref("users").child(uid + '/' + 'hostedSessions')
    .then((dataSnapshot) => {
        sessionKeys = Object.keys(dataSnapshot);
        res.status(200).json(sessionKeys);
    }).catch((error) => {
        res.status(404).json();
    })
})

module.exports = router;
