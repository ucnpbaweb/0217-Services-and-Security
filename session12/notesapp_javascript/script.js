var notesElm, menuElm;
var notes;

var noteTemplate = (note) => {
	var content = note.content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	return `<div class="note" data-id="${note.id}">
				<a data-id="${note.id}" href="edit">Edit</a>
				<a data-id="${note.id}" href="delete">Delete</a>
				<div class="content">${content}</div>
			</div>`;
};

var displayAllNotes = (e) => {
	var notes = e.detail.notes;
	var notesHtml = '';
	notes.forEach((note) => {
		notesHtml += noteTemplate(note);
	});
	notesElm.innerHTML = notesHtml;
};

var displayNewNote = (e) => {
	var note = e.detail.note;
	notesElm.innerHTML += noteTemplate(note);
};

var displayUpdatedNote = (e) => {
	var note = e.detail.note;
	var noteElm = notesElm.querySelector('div[data-id = "'+note.id+'"]');
	noteElm.outerHTML = noteTemplate(note);
};

var displayDeletedNote = (e) => {
	var id = e.detail.id;
	notesElm.querySelector('div[data-id = "'+id+'"]').outerHTML = '';
};

var submitNewNote = (e) => {
	e.preventDefault();
	var newnote = {};
	newnote.content = e.target.content.value;
	Notes.add(newnote, 'notecreated');
	e.target.reset();
	e.target.classList.add('hide');
};

var submitUpdateNote = (e) => {
	e.preventDefault();
	var note = {
		id: e.target.id.value,
		content: e.target.content.value
	};
	Notes.update(note, 'noteupdated');
	
	e.target.reset();
	e.target.classList.add('hide');
};

var noteElmClicked = (e) => {
	if(e.target.nodeName == 'A'){
		e.preventDefault();
		var action = e.target.attributes['href'].value;
		switch(action){
			case 'edit':
				var id = parseInt(e.target.attributes['data-id'].value);

				var note = Notes.find(id);

				document.forms.updatenote.content.value = note.content;
				document.forms.updatenote.id.value = note.id;
				document.forms.updatenote.classList.remove('hide');
				break;
			case 'delete':
				var id = parseInt(e.target.attributes['data-id'].value);
				Notes.delete(id, 'notedeleted');
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
	notesElm = document.getElementById('notes');
	menuElm = document.querySelector('body > nav');

	// events for user interface
	document.addEventListener('notesreceived', displayAllNotes, false);
	document.addEventListener('notecreated', displayNewNote, false);
	document.addEventListener('noteupdated', displayUpdatedNote, false);
	document.addEventListener('notedeleted', displayDeletedNote, false);

	notesElm.addEventListener('click', noteElmClicked, false);
	menuElm.addEventListener('click', menuClicked, false);

	document.forms.updatenote.addEventListener('submit', submitUpdateNote, false);
	document.forms.updatenote.addEventListener('click', formClicked, false);

	document.forms.newnote.addEventListener('submit', submitNewNote, false);
	document.forms.newnote.addEventListener('click', formClicked, false);

	//get all the notes
	Notes.getAll('notesreceived');
}, false);