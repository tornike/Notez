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

function displayOtherFieleds() {
    let a =  document.getElementById("new-note-entry");
    document.getElementById("new-note").addEventListener('focusin', function() {
        // document.getElementById("new-note").focus();
        console.log("FOCUS");
        document.getElementById("new-note-title").style.display = 'inline-block';
        document.getElementById("new-note-actions-row").style.display = 'inline-block';
        a.style.borderTop = 'none';
        a.style.borderBottom = 'none';
        a.style.borderTopLeftRadius = '0';
        a.style.borderTopRightRadius = '0';
    });
}

function hideOtherFieleds() {
    let a =  document.getElementById("new-note-entry");
    let b = document.getElementById("new-note");
    b.addEventListener('focusout', function () {
            var hasFocus = false;
            for(let i = 0; i < b.children.length; i++){
                console.log("a", document.activeElement);
                if(document.activeElement == b.children[i]){
                    console.log("b");
                    hasFocus = true;
                    break;
                }
            }
            if (!hasFocus) {
                document.getElementById("new-note-title").style.display = 'none';
                document.getElementById("new-note-actions-row").style.display = 'none';
                a.style.border = '1px solid #ccc';
                a.style.borderRadius = '3px';
            }
    });
}

ready(listenToCreate);
// ready(displayOtherFieleds);
// ready(hideOtherFieleds);