
function createNote(title, text, id, buttons, clas = "note") {
	let html = `
		<li id="note#${id}" class="${clas}">
			<input type="text" class="title" placeholder="Title" value=${title}>  
			<textarea class="entry" placeholder="Take a note...">${text}</textarea>
			<div class="note-actions-row" tabindex="0">
				<div class="dropbtn">
					<div>Color</div>
					<ul class="colors">
						<li>
							<button class="color white">
								White							
							</button>
						</li>
						<li>
							<button class="color red">
								Red
							</button>
						</li>
						<li>
							<button class="color yellow">
								Yellow
							</button>
						</li>
						<li>
							<button class="color green">
								Green
							</button>
						</li>
						<li>
							<button class="color blue">
								Blue
							</button>
						</li>
						<li>
							<button class="color violet">
								Violet
							</button>
						</li>
					</ul>
				</div>
				<div class="pad"></div>
				<button class="${buttons[0].toLowerCase()}-button">${buttons[0]}</button>
				<button class="${buttons[1].toLowerCase()}-button">${buttons[1]}</button>
				<button class="${buttons[2].toLowerCase()}-button">${buttons[2]}</button>
			</div>
      	</li>`;

	return html;
}

module.exports = createNote;