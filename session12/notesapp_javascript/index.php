<!DOCTYPE html>
<html>
	<head>
		<title>Notes App</title>
		<meta charset="utf-8"/>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script type="text/javascript" src="notes.js"></script>
		<script type="text/javascript" src="script.js"></script>
	</head>
	<body>
		<nav>
			<ul>
				<li><a href="new">New note</a></li>
			</ul>
		</nav>
		<div id="notes"></div>
		<form name="updatenote" class="hide">
			<a href="close" data-id="updatenote">x</a>
			<input name="id" type="hidden" />
			<textarea name="content"></textarea>
			<input name="update" type="submit" value="Update" />
		</form>
		<form name="newnote" class="hide">
			<a href="close" data-id="newnote">x</a>
			<textarea name="content"></textarea>
			<input name="new" type="submit" value="Save" />
		</form>
	</body>
</html>