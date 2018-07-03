
function createNote(title, text, id) {
	let html = `
		<li id="note#${id}" class="note">
			<input type="text" class="title" placeholder="Title" value=${title}>  
			<textarea class="entry" placeholder="Take a note...">${text}</textarea>
			<div class="note-actions-row">
				<button class="delete-button">Delete</button>        
				<button class="archive-button">Archive</button>        
				<button class="discard-button">Discard</button>
				<button class="save-button">Save</button>
			</div>
      	</li>`;

	return html;
}

module.exports = createNote;