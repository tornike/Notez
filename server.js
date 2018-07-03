var express = require("express");
var app = express();

var data = {notes: [], trash: [], archive: []};

/* Static resources - styles, images, etc. */
app.use(express.static('src'));
app.use(express.static('src/js'));
app.use(express.static('dist'));

/* Request main page */
app.get("/", function(req,res) {
	res.sendFile(__dirname + "/src/index.html");
});

app.get("/getNotes", function(req,res) {
	res.send(req.query);
});

app.listen(8000, function() {
	// visualize running server 
	console.log("listening on port 8000");
});