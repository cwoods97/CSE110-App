const express = require('express')
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/hello', function(req, res){
	res.json({message: "Hello World - Express API is live"});
})

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server listening on port ' + port)
})
