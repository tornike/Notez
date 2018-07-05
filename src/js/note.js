
function createNote(title, text, id, buttons) {
	let html = `
		<li id="note#${id}" class="note">
			<input type="text" class="title" placeholder="Title" value=${title}>  
			<textarea class="entry" placeholder="Take a note...">${text}</textarea>
			<div class="note-actions-row">
				<button class="${buttons[0].toLowerCase()}-button">${buttons[0]}</button>
				<button class="${buttons[1].toLowerCase()}-button">${buttons[1]}</button>
				<button class="${buttons[2].toLowerCase()}-button">${buttons[2]}</button>
			</div>
      	</li>`;

	return html;
}

module.exports = createNote;