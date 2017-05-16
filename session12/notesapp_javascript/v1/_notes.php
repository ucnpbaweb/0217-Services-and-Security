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

	if($_SERVER['REQUEST_METHOD'] == 'GET' && array_key_exists('id', $_GET) && !empty($_GET['id'])){
		# requesting a sigle note by id
		$select = $conn->prepare("SELECT * FROM note WHERE id=:id");
		$select->bindParam(":id", $_GET['id'], PDO::PARAM_INT);

		if($select->execute()){
			$obj->note = $select->fetchObject("Note");
			$obj->action = 'getbyid';
		}

	} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
		# requesting all notes
		$select = $conn->prepare("SELECT * FROM note");
		if($select->execute()){
			$obj->notes = $select->fetchAll(PDO::FETCH_CLASS, "Note");
			$obj->action = 'getall';
		}
	} elseif($_SERVER['REQUEST_METHOD'] == 'POST'){
		# create a new note
		$insert = $conn->prepare("INSERT INTO note (content) VALUES (:content)");
		$insert->bindParam(":content", $note->content, PDO::PARAM_STR);

		if($insert->execute()){
			$obj->alert = "note created!";
			$lastid = $conn->lastInsertId();
			$select = $conn->prepare("SELECT * FROM note WHERE id=:id");
			$select->bindParam(":id", $lastid, PDO::PARAM_INT);

			if($select->execute()){
				$obj->note = $select->fetchObject("Note");
				$obj->action = 'post';
			}
		}
		
	} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT' && array_key_exists('id', $_GET)) {
		# update and existing note
		$id = intval($_GET['id']);
		$update = $conn->prepare("UPDATE note SET updated=NOW(), content=:content WHERE id=:id");
		$update->bindParam(":content", $note->content, PDO::PARAM_STR);
		$update->bindParam(":id", $id, PDO::PARAM_INT);
		
		if($update->execute()){
			$select = $conn->prepare("SELECT * FROM note WHERE id=:id");
			$select->bindParam(":id", $id, PDO::PARAM_INT);

			if($select->execute()){
				$obj->note = $select->fetchObject("Note");
			}
			$obj->action = 'put';
		}
	} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE' && array_key_exists('id', $_GET)) {
		$id = intval($_GET['id']);
		$delete = $conn->prepare("DELETE FROM note WHERE id=:id");
		$delete->bindParam(":id", $id, PDO::PARAM_INT);

		if($delete->execute()){
			$obj->id = $id;
			$obj->action = 'delete';
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