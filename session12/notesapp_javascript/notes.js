var Notes = (() => {
	var notes = [];
	var version = 'v1';

	var req = (callback, method, url, customevent, content) => {
		//create a new request
		var request = new Request(url, {method : method, body : (content)?content:null});

		fetch(request).then((response) => {
			//return the content of the response
			return response.json();
		}).then((content) => {
			// create a custom event
			callback(content);
			var event = new CustomEvent(customevent, {
				'detail': content
			});
			document.dispatchEvent(event);
		});
	};

	var addAllNotes = (response) => {
		notes = response.notes;
	};

	var addNewNote = (response) => {
		notes.push(response.note);
	};

	var updateNote = (response) => {
		var id = response.note.id;
		
		notes.find((note, i) => {
			if(note.id == id){
				notes[i] = response.note;
			}
		});
	};

	var findNoteById = (id) => {
		return notes.find((note) => {
			return note.id == id;
		});
	};

	var deleteNote = (response) => {
		var id = response.id;
		notes = notes.filter((note) => {
			return note.id != id;
		});
	};

	return {
		find: (id) => {
			return findNoteById(id);
		},
		getAll: (eventName) => {
			req(addAllNotes, 'GET', version+'/notes', eventName);
		},
		add: (note, eventName) => {
			req(addNewNote, 'POST', version+'/notes', eventName, JSON.stringify(note));
		},
		update: (note, eventName) => {
			req(updateNote, 'PUT', version+'/notes/'+note.id, eventName, JSON.stringify(note));
		},
		delete: (id, eventName) => {
			req(deleteNote ,'DELETE', version+'/notes/'+id, eventName);
		}
	};

})();