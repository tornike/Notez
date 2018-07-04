var express = require("express");
var app = express();

var data = {"notes": [], "trash": [], "archive": []};

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
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/src/index.html");
});

app.get("/getNotes", function(req, res) {
	var d = data[req.query["param"]];
	var stringToSend = "";
	for (var i = 0; i < d.length; d++) {
		stringToSend += JSON.stringify(d[i]);
	}
	res.send(stringToSend);
});

app.post("/saveNote", function(req, res) {
	console.log("save", req.body);
	data["notes"].push(req.body);
	res.send(JSON.stringify({"success":true}));
});

function transferNote(from, to, id){
	for (var i = 0; i < data[from].length; i++) {
		const element = data[from][i];
		if(element["id"] == id){
			data[to] = data[from].pop(i);
		}
	}
}

app.post("/archiveNote", function(req, res) {
	console.log("archive", req.body);
	transferNote("notes", "archive", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteNote", function(req, res) {
	transferNote("notes", "trash", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/bringBackArchieved", function(req, res) {
	transferNote("archive", "notes", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteArchieved", function(req, res) {
	transferNote("archive", "trash", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/bringBackDeleted", function(req, res) {
	transferNote("trash", "notes", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/archiveDeleted", function(req, res) {
	transferNote("trash", "archive", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteFromTrash", function(req, res) {
	for (var i = 0; i < data["trash"].length; i++) {
		const element = data["trash"][i];
		if(element["id"] == id){
			data["trash"].pop(i);
		}
	}
	res.send(JSON.stringify({"success":true}));
});


app.listen(8000, function() {
	// visualize running server 
	console.log("listening on port 8000");
});