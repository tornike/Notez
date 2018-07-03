var express = require("express");
var app = express();

var data = {notes: [], trash: [], archive: []};

/* Static resources - styles, images, etc. */
app.use(express.static('src'));
app.use(express.static('src/js'));
app.use(express.static('dist'));

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/* Request main page */
app.get("/", function(req,res) {
	res.sendFile(__dirname + "/src/index.html");
});

app.get("/getNotes", function(req,res) {
	res.send(req.query);
});

app.post("/saveNote", function(req, res) {
	res.send(req.body);
	console.log(req.body);
});

app.listen(8000, function() {
	// visualize running server 
	console.log("listening on port 8000");
});