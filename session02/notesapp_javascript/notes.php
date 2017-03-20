<?php
	header('Content-type: application/json; charset=UTF-8');

	// get the content of the request
	$input = file_get_contents("php://input");
	$note = json_decode($input);
	
	// db connection
	$conn = new PDO('mysql:host=localhost;dbname=user1_notes;charset=utf8', 'user1', 'IHcvGD5noxwhy1S5');

	// init object for the responce
	$obj = (object)[];
	$obj->action = 'error';

	if ($_SERVER['REQUEST_METHOD'] == 'GET') {
		# requesting all notes
		$select = $conn->prepare("SELECT * FROM note");
		if($select->execute()){
			$obj->notes = $select->fetchAll(PDO::FETCH_CLASS, "Note");
			$obj->action = 'getall';
		}
	}
	elseif($_SERVER['REQUEST_METHOD'] == 'POST'){
		# create a new note
		$insert = $conn->prepare("INSERT INTO note (content) VALUES (:content)");
		$insert->bindParam(":content", $note->content, PDO::PARAM_STR);

		if($insert->execute()){
			$obj->alert = "note created!";
		}
		$select = $conn->prepare("SELECT * FROM note WHERE id=:id");
		$select->bindParam(":id", $conn->lastInsertId(), PDO::PARAM_INT);

		if($select->execute()){
			$obj->note = $select->fetchObject("Note");
			$obj->action = 'post';
		}
	}
	// echo out the object
	echo json_encode($obj);

	class Note
	{
		public $id;
		public $content;
		public $updated;
	}
?>