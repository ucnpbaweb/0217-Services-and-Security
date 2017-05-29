var Notes = (() => {
	var notes = [];
	var version = 'v1';

	var req = async (method, url, content) => {
		//create a new request
		var request = new Request(url, {method : method, body : (content)?content:null});
		// wait for the response
		var response = await fetch(request);
		// wait for the content of the response and return it
		return await response.json();
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
		getAll: () => {
			return req('GET', version+'/notes').then(resp => {
				addAllNotes(resp);
				return resp;
			});
		},
		add: (note) => {
			return req('POST', version+'/notes', JSON.stringify(note)).then(resp => {
				addNewNote(resp);
				return resp;
			});
		},
		update: (note) => {
			return req('PUT', version+'/notes/'+note.id, JSON.stringify(note)).then(resp => {
				updateNote(resp);
				return resp;
			});
		},
		delete: (id) => {
			return req(deleteNote ,'DELETE', version+'/notes/'+id).then(resp => {
				deleteNote(resp);
				return resp;
			});
		}
	};

})();