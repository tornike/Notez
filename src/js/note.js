
function createNote(title, text) {
	let html = `
		<li class="note">
			<input type="text" class="title" placeholder="Title" value=${title}>  
			<input type="text" class="entry" value=${text}>
			<div class="note-actions-row">
				<button class="discard-button">Discard</button>
				<button class="save-button">Save</button>
			</div>
      	</li>`;

	return html;
}

module.exports = createNote;