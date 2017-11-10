const express = require('express')
const path = require('path');
const app = express()

/*  
 *  Serves static files from the 'client/build' directory
 *  Navigating to root of webserver serves 'index.html'
 *  Disable this functionality when not in production (running two separate servers)
 */
var is_production = process.argv[2]
if (is_production) {
	app.use(express.static(path.join(__dirname, 'client/build')));
}

app.get('/api/hello', function(req, res){
	res.json({message: "Hello World - Express API is live"});
})

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})
