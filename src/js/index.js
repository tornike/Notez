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

        let noteStr = createNote(newTitle.value, newEntry.value, nextId, noteButtons("notes"));
        notes.insertAdjacentHTML("beforeend", noteStr);

        let note = document.getElementById("note#" + nextId++);
        initNote(note, "notes");
        saveNote(note);

        newTitle.value = "";
        newEntry.value = "";
        newEntry.style.height = "45px";
        saveButton.blur();
    });
}

function initNoteButtons(type, actionsRow) {
    switch (type) {
        case ("notes"):
            actionsRow.getElementsByClassName("save-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                saveNote(note);
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "deleteNote");
            });
            actionsRow.getElementsByClassName("archive-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "archiveNote");
            });
            break;
        case ("trash"):
            actionsRow.getElementsByClassName("restore-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "restoreNote");
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "deleteFromTrash");
            });
            break;
        case ("archive"):
            actionsRow.getElementsByClassName("unarchive-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "unArchiveNote");
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                let id = note.id.replace("note#", "");
                note.parentElement.removeChild(note);
                actionButtonHandler(id, "deleteArchived");
            });
            break;
        default:
            console.log(type);
            break;
    }
}

function initNote(note, notesType) {
    let entry = note.children[1];
    entry.addEventListener ("input", resizeTextarea);

    let actionsRow = note.children[2];
    initNoteButtons(notesType, actionsRow);
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

function saveNote(note){
    let title = note.getElementsByClassName("title")[0].value;
    let text = note.getElementsByClassName("entry")[0].value;
    let id = note.id.replace("note#", "");

    params = {};
    params["title"] = title;
    params["text"] = text;
    params["id"] = id;

    sendAjaxPostRequest("saveNote", JSON.stringify(params), postCallback);
}

function actionButtonHandler (noteId, action) {
    sendAjaxPostRequest(action, JSON.stringify({"id": noteId}), postCallback);
}

function deleteNote(event){
    let id = event.target.parentElement.parentElement.id.replace("note#", "");
    sendAjaxPostRequest("deleteNote", JSON.stringify({"id":id}), postCallback);
}

function restoreNote(event){
    let id = event.target.parentElement.parentElement.id.replace("note#", "");
    sendAjaxPostRequest("restoreNote", JSON.stringify({"id":id}), postCallback);
}

function archiveNote(event){
    let id = event.target.parentElement.parentElement.id.replace("note#", "");
    sendAjaxPostRequest("archiveNote", JSON.stringify({"id":id}), postCallback);
}

function unArchiveNote(event){
    let id = event.target.parentElement.parentElement.id.replace("note#", "");
    sendAjaxPostRequest("unArchiveNote", JSON.stringify({"id":id}), postCallback);
}

ready(initSidebar);
ready(initNewNote);

function noteButtons(type) {
    let buttons = [];
    switch (type) {
        case ("notes"):
            buttons[0] = "Save";
            buttons[1] = "Discard";
            buttons[2] = "Archive";
            buttons[3] = "Delete";
            break;
        case ("trash"):
            buttons[0] = "";
            buttons[1] = "";
            buttons[2] = "Restore";
            buttons[3] = "Delete";
            break;
        case ("archive"):
            buttons[0] = "";
            buttons[1] = "";
            buttons[2] = "Unarchive";
            buttons[3] = "Delete";
            break;
    }
    return buttons;
}

function getCallback(dataStr, reqNotesType) {
    let notesElem = document.getElementById("notes");
    // load new notes
    let data = dataStr.split(";");
    let notesStr = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i] == "") break;
        let noteJson = JSON.parse(data[i]);
        let buttons = noteButtons(reqNotesType);
        notesStr += createNote(noteJson["title"], noteJson["text"], noteJson["id"], buttons);
    }
    notesElem.insertAdjacentHTML("beforeend", notesStr);

    let notes = notesElem.getElementsByClassName("note");
    for (let i = 0; i < notes.length; i++) {
        initNote(notes[i], reqNotesType);
    }
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
            callback(data, url.split("=")[1]);
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

function searchNotes(){
    let searchBar = document.getElementsByClassName("search")[0].children[0];
    searchBar.addEventListener("keyup", function() {
        let filter, ul, li, title, entry, everything, i;
    
        filter = searchBar.value.toUpperCase();
        ul = document.getElementById("notes");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            title = li[i].getElementsByClassName("title")[0].value;
            entry = li[i].getElementsByClassName("entry")[0].value;
            everything = title + entry;
            if (everything.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });
}

ready(searchNotes);

