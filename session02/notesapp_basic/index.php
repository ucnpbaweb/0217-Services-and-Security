<?php
$conn = new PDO('mysql:host=localhost;dbname=user1_notes;charset=utf8', 'user1', 'IHcvGD5noxwhy1S5');

$obj = (object)[];

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	if(array_key_exists('id', $_POST) && array_key_exists('content', $_POST)){
		#update note
		$update = $conn->prepare("UPDATE note SET content=:content, updated=NOW() WHERE id=:id");
		$update->bindParam(":content", $_POST['content'], PDO::PARAM_STR);
		$update->bindParam(":id", $_POST['id'], PDO::PARAM_INT);
		if($update->execute()){
			$obj->alert = "note updated!";
		}
	}elseif (array_key_exists('content', $_POST)) {
		# new note
		$insert = $conn->prepare("INSERT INTO note (content) VALUES (:content)");
		$insert->bindParam(":content", $_POST['content'], PDO::PARAM_STR);

		if($insert->execute()){
			$obj->alert = "note created!";
		}
	}
}

if(array_key_exists('action', $_GET) && array_key_exists('id', $_GET)){
	# something with a note
	if($_GET['action'] == 'edit'){
		$select = $conn->prepare("SELECT * FROM note WHERE id=:id");
		$select->bindParam(":id", $_GET['id'], PDO::PARAM_INT);
		if($select->execute()){
			$obj->note = $select->fetchObject("Note");
			$obj->action = 'edit';
		}
	}
}elseif (array_key_exists('action', $_GET)) {
	# some other action
	if ($_GET['action'] == 'new') {
		$obj->action = 'new';
	}
}

# requesting all notes
$select = $conn->prepare("SELECT * FROM note");
if($select->execute()){
	$obj->notes = $select->fetchAll(PDO::FETCH_CLASS, "Note");
}

class Note
{
	public $id;
	public $content;
	public $updated;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Notes App</title>
		<meta charset="utf-8"/>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>
		<nav>
			<ul>
				<li><a href="?action=new">New note</a></li>
			</ul>
		</nav>
		<div id="notes">
			<?php foreach ($obj->notes as $note) {?>
				<div class="note" data-id="<?php echo $note->id; ?>">
					<a href="/session02/notesapp_basic/?action=edit&amp;id=<?php echo $note->id; ?>">Edit</a>
					<div class="content">
						<?php echo nl2br($note->content); ?>
					</div>
				</div>
			<?php } ?>
		</div>
		<?php if($obj->action == 'edit'){ ?>
			<form method="POST" action="/session02/notesapp_basic/">
				<a href="/session02/notesapp_basic/">x</a>
				<input name="id" type="hidden" value="<?php echo $obj->note->id; ?>" />
				<textarea name="content"><?php echo $obj->note->content; ?></textarea>
				<input name="update" type="submit" value="Update" />
			</form>
		<?php } ?>
		<?php if($obj->action == 'new'){ ?>
			<form method="POST" action="/session02/notesapp_basic/">
				<a href="/session02/notesapp_basic/">x</a>
				<textarea name="content"></textarea>
				<input name="new" type="submit" value="Save" />
			</form>
		<?php } ?>
	</body>
</html>