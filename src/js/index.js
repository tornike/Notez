let createNote = require("./note.js");

let nextId = 0;

function initSidebar() {
    let sidebarButton = document.getElementById("sidebar-button");
    sidebarButton.addEventListener("click", function() {
        let sidebar = document.getElementById("sidebar");
        if (sidebar.style.display == "none") {
            sidebar.style.display = "";
            document.getElementById("main-area").style.width = "calc(100% - 250px)";
        } else {
            sidebar.style.display = "none";
            document.getElementById("main-area").style.width = "100%";
        }
    });
}

function createNewNote() {
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
    newNote.getElementsByClassName("save-button")[0].blur();
}

function initNewNote() {
    let newNote = document.getElementById("new-note");
    let newEntry = newNote.getElementsByClassName("entry")[0];
    newEntry.addEventListener("input", resizeTextarea);
    let newTitle = newNote.getElementsByClassName("title")[0];
    newNote.addEventListener("focusout", function() {
        if (window.getComputedStyle(newTitle).display == "none" &&
            (newTitle.value != "" || newEntry.value != ""))
        { // newNote lost focus.
            createNewNote();
        }
    });
    let saveButton = newNote.getElementsByClassName("save-button")[0];
    saveButton.addEventListener("click", createNewNote);
}

function actionButtonHandler (note, action) {
    let id = note.id.replace("note#", "");
    note.parentElement.removeChild(note);
    sendAjaxPostRequest(action, JSON.stringify({"id": id}), postCallback);
}

function initNoteButtons(type, actionsRow) {

    let colors = actionsRow.getElementsByClassName("color");
    for(let i = 0; i < colors.length; i++){
        let colorButton = colors[i];
        colorButton.addEventListener("click", function(event) {
            let noteElem = colorButton.parentElement.parentElement.parentElement.parentElement.parentElement;
            noteElem.className = noteElem.className.split(" ")[0] + " " + colorButton.className.split(" ")[1];
            noteElem.children[1].focus();
        });
    }

    switch (type) {
        case ("notes"):
            actionsRow.getElementsByClassName("save-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                saveNote(note);
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "deleteNote");
            });
            actionsRow.getElementsByClassName("archive-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "archiveNote");
            });
            break;
        case ("trash"):
            actionsRow.getElementsByClassName("restore-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "restoreNote");
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "deleteFromTrash");
            });
            break;
        case ("archive"):
            actionsRow.getElementsByClassName("unarchive-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "unArchiveNote");
            });
            actionsRow.getElementsByClassName("delete-button")[0].addEventListener("click", function(event) {
                let note = event.target.parentElement.parentElement;
                actionButtonHandler(note, "deleteArchived");
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
    if (notesType == "notes") {
        note.addEventListener("focusout", function() {
            if (window.getComputedStyle(actionsRow).display == "none") { // note lost focus.
                saveNote(note);
            }
        });
    }
    initNoteButtons(notesType, actionsRow);
    note.getElementsByClassName("entry")[0].fn = resizeTextarea;
    note.getElementsByClassName("entry")[0].fn();
    note.getElementsByClassName("entry")[0].fn = null;
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

function saveNote(note) {
    let title = note.getElementsByClassName("title")[0].value;
    let text = note.getElementsByClassName("entry")[0].value;
    let id = note.id.replace("note#", "");
    let color = note.className;

    params = {};
    params["title"] = title;
    params["text"] = text;
    params["id"] = id;
    params["color"] = color;

    sendAjaxPostRequest("saveNote", JSON.stringify(params), postCallback);
}

ready(initSidebar);
ready(initNewNote);

function noteButtons(type) {
    let buttons = [];
    switch (type) {
        case ("notes"):
            buttons[2] = "Save";
            buttons[1] = "Archive";
            buttons[0] = "Delete";
            break;
        case ("trash"):
            buttons[2] = "";
            buttons[1] = "Restore";
            buttons[0] = "Delete";
            break;
        case ("archive"):
            buttons[2] = "";
            buttons[1] = "Unarchive";
            buttons[0] = "Delete";
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
        notesStr += createNote(noteJson["title"], noteJson["text"], noteJson["id"], buttons, noteJson["color"]);
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

function sendAjaxPostRequest(url, params, callback) {
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

    request.onerror = function() {
        // There was a connection error of some sort
        console.log("error");
    };
	request.send();
}

Router.config({mode: "hash"});
Router.add("notez", function() {
    document.getElementById("new-note").style.display = "";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=notes", getCallback);
});
Router.add("reminders", function() {
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=reminders", getCallback);
});
Router.add("archive", function() {
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=archive", getCallback);
});
Router.add("trash", function() {
    document.getElementById("new-note").style.display = "none";
    document.getElementById("notes").innerHTML = "";
    sendAjaxRequest("/getNotes?param=trash", getCallback);
});
Router.listen();
Router.navigate("notez");

function searchNotes() {
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

