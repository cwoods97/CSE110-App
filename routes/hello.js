var express = require('express');
var router = express.Router();

// TODO Start moving routes into a 'routes' folder and use express router
// TODO Put in the actual route names (see design use cases)
router.get('/hi', (req, res) => {
	res.json({message: "'hello.api' responding"});
})

module.exports = router;
