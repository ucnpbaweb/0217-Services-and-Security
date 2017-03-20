var notesElm, menuElm;
var notes = [];

var req = (method, url, customevent, content) => {
	var request = new XMLHttpRequest();
	//custom properties
	request.customcontent = content;
	request.customevent = customevent;
	request.open(method, url);
	request.addEventListener('readystatechange', readystateHandler, false);
	request.send(content ? content : null);
};

var readystateHandler = (e) => {
	if(e.target.readyState == 4 && e.target.status == 200){
		var event = new CustomEvent(e.target.customevent, {
			'detail': JSON.parse(e.target.response)
		});
		document.dispatchEvent(event);
	}
};

var addAllNotes = (e) => {
	notes = e.detail.notes;
};

var addNewNote = (e) => {
	var note = e.detail.note;
	notes.push(note);
};

var displayAllNotes = (e) => {
	var notes = e.detail.notes;
	var notesHtml = '';
	notes.forEach((note) => {
		var content = note.content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
		notesHtml += `<div class="note" data-id="${note.id}">
				<a data-id="${note.id}" href="edit">Edit</a>
				<div class="content">${content}</div>
			</div>`;
	});
	notesElm.innerHTML = notesHtml;
};

var displayNewNote = (e) => {
	var note = e.detail.note;
	console.log(note);
	noteHtml = `<div class="note" data-id="${note.id}">
				<a data-id="${note.id}" href="edit">Edit</a>
				<div class="content">${note.content}</div>
			</div>`;
	notesElm.innerHTML += notesElm;
};

var submitNewNote = (e) => {
	e.preventDefault();
	var newnote = {};
	newnote.content = e.target.content.value;
	console.log(newnote);
	req('POST', 'notes.php', 'newnotecreated', JSON.stringify(newnote));
	document.forms.newnote.reset();
	document.forms.newnote.classList.add('hide');
};

var notesClicked = (e) => {
	if(e.target.nodeName == 'A'){
		e.preventDefault();
		var action = e.target.attributes['href'].value;
		switch(action){
			case 'edit':
				var id = parseInt(e.target.attributes['data-id'].value);
				console.log(id);
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

	//events
	document.addEventListener('allnotesreceived', displayAllNotes, false);
	document.addEventListener('newnotecreated', displayNewNote, false);

	document.addEventListener('allnotesreceived', addAllNotes, false);
	document.addEventListener('newnotecreated', addNewNote, false);
	
	notesElm.addEventListener('click', notesClicked, false);
	menuElm.addEventListener('click', menuClicked, false);

	document.forms.newnote.addEventListener('submit', submitNewNote, false);
	document.forms.newnote.addEventListener('click', formClicked, false);

	//get alle the notes
	req('GET', 'notes.php', 'allnotesreceived');
}, false);