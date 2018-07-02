let createNote = require("./note.js");

function listenToCreate() {
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

function hideOtherFieleds() {
    let a =  document.getElementById("new-note-entry");
    a.addEventListener("input", function () {
        var body = document.body,
            html = document.documentElement;

        // var height = Math.max( body.scrollHeight, body.offsetHeight, 
                            // html.clientHeight, html.scrollHeight, html.offsetHeight );

        // console.log(html.clientHeight - a.scrollHeight);
        // console.log(html.clientHeight);
        if(html.clientHeight - a.scrollHeight < 200){
            a.style.height = html.clientHeight-200+"px";
            a.style.maxHeight = html.clientHeight;
            a.style.overflowY = "scroll";
        }else{
            a.style.overflowY = "hidden";
            a.style.height = "auto";
            a.style.height = (a.scrollHeight)+"px";
        }
        
    });
}

ready(listenToCreate);
ready(hideOtherFieleds);