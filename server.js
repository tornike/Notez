var express = require("express");
var app = express();

var data = {"notes": [], "trash": [], "archive": [], "reminders": []};

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
	for (var i = 0; i < d.length; i++) {
		stringToSend += (JSON.stringify(d[i]) + ";");
	}
	res.send(stringToSend);
});

app.post("/saveNote", function(req, res) {
	var arr = data["notes"];
	var isFound = false;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i].id == req.body.id){
			arr[i] = req.body;
			isFound = true;
			break;
		}
	}
	if(!isFound){
		data["notes"].push(req.body);
	}

	console.log("save", req.body);
	res.send(JSON.stringify({"success": true}));
});

function transferNote(from, to, id) {
	for (var i = 0; i < data[from].length; i++) {
		var elem = data[from][i];
		if (elem["id"] == id) {
			data[to].push(data[from].splice(i, 1)[0]);
			break;
		}
	}
}

app.post("/archiveNote", function(req, res) {
	console.log("transfer from notes to archive", req.body);
	transferNote("notes", "archive", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/unArchiveNote", function(req, res) {
	console.log("transfer from archive to notes", req.body);
	transferNote("archive", "notes", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteArchived", function(req, res) {
	console.log("transfer from archive to trash", req.body);
	transferNote("archive", "trash", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteNote", function(req, res) {
	console.log("transfer from notes to trash", req.body);
	transferNote("notes", "trash", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/restoreNote", function(req, res) {
	console.log("transfer from trash to notes", req.body);
	transferNote("trash", "notes", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/archiveDeleted", function(req, res) {
	transferNote("trash", "archive", req.body.id);
	res.send(JSON.stringify({"success":true}));
});

app.post("/deleteFromTrash", function(req, res) {
	console.log("delete from trash", req.body);
	for (var i = 0; i < data["trash"].length; i++) {
		const element = data["trash"][i];
		if(element["id"] == req.body.id){
			data["trash"].splice(i, 1);
		}
	}
	res.send(JSON.stringify({"success":true}));
});


app.listen(8000, function() {
	// visualize running server 
	console.log("listening on port 8000");
});