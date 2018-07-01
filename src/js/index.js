let createNote = require("./note.js");

function listenToCreate() {
    let createButtons = document.getElementsByClassName("save-button");
    let notes = document.getElementById("notes");
    let a = document.getElementById("new-note");
    let b = a.getElementsByClassName("title")[0];
    let c = a.getElementsByClassName("entry")[0]
    createButtons[0].addEventListener("click", function() {
        let newNote = createNote(b.value, c.value);
        notes.insertAdjacentHTML("beforeend", newNote);
        b.value = "";
        c.value = "";
    });
}

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(listenToCreate);

