let createNote = require("./note.js");
let nextId = 0;

function initSidebar() {
    let sidebarButton = document.getElementById("sidebar-button");
    sidebarButton.addEventListener("click", function() {
        let sidebar = document.getElementById("sidebar");
        if (sidebar.style.display == 'none') {
            sidebar.style.display = '';
            document.getElementById('main-area').style.width = "calc(100% - 250px)";
        } else {
            sidebar.style.display = 'none';
            document.getElementById('main-area').style.width = "100%";
        }
    });
}

function initNewNote() {
    let newNote = document.getElementById("new-note");
    let saveButton = newNote.getElementsByClassName("save-button")[0];
    let newEntry = newNote.getElementsByClassName("entry")[0];
    newEntry.addEventListener("input", resizeTextarea);

    saveButton.addEventListener("click", function() {
        let newNote = document.getElementById("new-note");
        let newTitle = newNote.getElementsByClassName("title")[0];
        let newEntry = newNote.getElementsByClassName("entry")[0];
        let noteStr = createNote(newTitle.value, newEntry.value, nextId);

        notes.insertAdjacentHTML("beforeend", noteStr);
        let note = document.getElementById("note#" + nextId++);
        let entry = note.children[1];
        entry.addEventListener ("input", resizeTextarea);

        saveButton = note.children[2].getElementsByClassName("save-button")[0];
        saveButton.addEventListener("click", saveNote);

        deleteButton = note.children[2].getElementsByClassName("delete-button")[0];
        deleteButton.addEventListener("click", deleteNote);

        archiveButton = note.children[2].getElementsByClassName("archive-button")[0];
        archiveButton.addEventListener("click", archiveNote);

        let params = {};
        params["title"] = newTitle.value;
        params["text"] = newEntry.value;
        params["id"] = note.id;

        sendAjaxPostRequest("saveNote", JSON.stringify(params), postCallback);

        newTitle.value = "";
        newEntry.value = "";
    });
}

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function resizeTextarea () {
    let html = document.documentElement;
    if(html.clientHeight - this.scrollHeight < 200) {
        this.style.height = html.clientHeight-200+"px";
        this.style.maxHeight = html.clientHeight;
        this.style.overflowY = "scroll";
    } else {
        this.style.overflowY = "hidden";
        this.style.height = "auto";
        this.style.height = (this.scrollHeight)+"px";
    }
}

function saveNote(event){
    let note = event.target.parentElement.parentElement;

    let title = note.getElementsByClassName("title")[0].value;
    let text = note.getElementsByClassName("entry")[0].value;
    let id = note.id.replace("note#", "");

    params = {};
    params["title"] = title;
    params["text"] = text;
    params["id"] = id;

    sendAjaxPostRequest("saveNote", JSON.stringify(params), postCallback);
}

function deleteNote(event){
    let id = event.target.parentElement.parentElement.id;
    sendAjaxPostRequest("deleteNote", JSON.stringify({"id":id}), postCallback);
}

function archiveNote(event){
    let id = event.target.parentElement.parentElement.id;
    sendAjaxPostRequest("archiveNote", JSON.stringify({"id":id}), postCallback);
}

ready(initSidebar);
ready(initNewNote);

function getCallback(dataStr) {
    let notes = document.getElementById("notes");
    // load new notes
    let data = dataStr.split(";");
    let notesStr = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i] === "") break;
        let noteJson = JSON.parse(data[i]);
        console.log(noteJson);
        notesStr += createNote(noteJson["title"], noteJson["text"], noteJson["id"]);
        //let noteStr = createNote(noteJson["title"], noteJson["text"], noteJson["id"]);
    }
    notes.insertAdjacentHTML("beforeend", notesStr);
}

function postCallback(data) {
    console.log("post: " + data);
}

function sendAjaxPostRequest(url, params, callback){
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = request.responseText;
            callback(data);
        } else {
            // We reached our target server, but it returned an error
            console.log("Server Error");
        }
    };

    request.onerror = function(){
        // There was a connection error of some sort
        console.log("error");
    };
	request.send(params);
}

function sendAjaxRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = request.responseText;
            callback(data);
        } else {
            // We reached our target server, but it returned an error
            console.log("Server Error");
        }
    };

    request.onerror = function(){
        // There was a connection error of some sort
        console.log("error");
    };
	request.send();
}

Router.config({mode: "hash"});
Router.add("notez", function(){
    document.getElementById("new-note").style.display = "";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=notes", getCallback);
});
Router.add("reminders", function(){
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=reminders", getCallback);
});
Router.add("archive", function(){
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=archive", getCallback);
});
Router.add("trash", function(){
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=trash", getCallback);
});
Router.navigate("notez");
Router.listen();
