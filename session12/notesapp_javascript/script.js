var noteTemplate = (note) => {
	var content = note.content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	return `<div class="note" data-id="${note.id}">
				<a href="edit">Edit</a>
				<a href="delete">Delete</a>
				<div class="content">${content}</div>
			</div>`;
};

var displayAllNotes = (notesElm, notes) => {
	var notesHtml = '';
	notes.forEach((note) => {
		notesHtml += noteTemplate(note);
	});
	notesElm.innerHTML = notesHtml;
};

var displayNewNote = (notesElm, note) => {
	notesElm.innerHTML += noteTemplate(note);
};

var displayUpdatedNote = (noteElm, note) => {
	noteElm.outerHTML = noteTemplate(note);
};

var displayDeletedNote = (noteElm) => {
	noteElm.outerHTML = '';
};

var submitNewNote = (e) => {
	e.preventDefault();
	var notesElm = document.getElementById('notes');
	var newnote = {};
	newnote.content = e.target.content.value;

	Notes.add(newnote).then(resp => {
		displayNewNote(notesElm, resp.note);
	});

	e.target.reset();
	e.target.classList.add('hide');
};

var submitUpdateNote = (e) => {
	e.preventDefault();
	var note = {
		id: e.target.id.value,
		content: e.target.content.value
	};
	Notes.update(note).then(resp => {
		displayUpdatedNote(e.target.targetElement, resp.note);
	});
	
	e.target.reset();
	e.target.classList.add('hide');
};

var noteElmClicked = (e) => {
	if(e.target.nodeName == 'A'){
		console.log(e);
		e.preventDefault();
		var action = e.target.attributes['href'].value;
		var noteElm = e.target.parentNode;
		var id = parseInt(noteElm.attributes['data-id'].value);
		switch(action){
			case 'edit':
				var note = Notes.find(id);

				document.forms.updatenote.content.value = note.content;
				document.forms.updatenote.id.value = note.id;
				document.forms.updatenote.classList.remove('hide');
				document.forms.updatenote.targetElement = noteElm;
				break;
			case 'delete':
				Notes.delete(id).then(resp => {
					displayDeletedNote(noteElm);
				});
				break;
		}
	}
};

var menuClicked = (e) => {
	if(e.target.nodeName == 'A'){
		e.preventDefault();
		var action = e.target.attributes['href'].value;
		switch(action){
			case 'new':
				document.forms.newnote.classList.remove('hide');
				break;
		}
	}
};

var formClicked = (e) => {
	if(e.target.nodeName == 'A'){
		e.preventDefault();
		var action = e.target.attributes['href'].value;
		switch(action){
			case 'close':
				document.forms[e.target.attributes['data-id'].value].reset();
				document.forms[e.target.attributes['data-id'].value].classList.add('hide');
				break;
		}
	}
};

window.addEventListener('load', () => {
	//elements
	var notesElm = document.getElementById('notes');
	var menuElm = document.querySelector('body > nav');

	notesElm.addEventListener('click', noteElmClicked, false);
	menuElm.addEventListener('click', menuClicked, false);

	document.forms.updatenote.addEventListener('submit', submitUpdateNote, false);
	document.forms.updatenote.addEventListener('click', formClicked, false);

	document.forms.newnote.addEventListener('submit', submitNewNote, false);
	document.forms.newnote.addEventListener('click', formClicked, false);

	//get all the notes
	Notes.getAll().then(resp => {
		displayAllNotes(notesElm, resp.notes);
	});
}, false);