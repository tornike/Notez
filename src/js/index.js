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

ready(initSidebar);
ready(initNewNote);

function callback(data){
    console.log(data);
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

    request.onerror = function() {
        // There was a connection error of some sort
        console.log("error");
    };
	request.send();
}

Router.config({mode: "hash"});
Router.add("notez", function(){
    document.getElementById("new-note").style.display = "";
    sendAjaxRequest("/getNotes?param=notez", callback);
});
Router.add("reminders", function(){
    document.getElementById("new-note").style.display = "none";
    sendAjaxRequest("/getNotes?param=reminders", callback);
});
Router.add("archive", function(){
    document.getElementById("new-note").style.display = "none";
    sendAjaxRequest("/getNotes?param=archive", callback);
});
Router.add("trash", function(){
    document.getElementById("new-note").style.display = "none";
    sendAjaxRequest("/getNotes?param=trash", callback);
});
Router.navigate("notez");
Router.listen();
