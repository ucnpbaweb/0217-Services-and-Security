<?php
$location = '';
$obj = (object)['results' => null, 'message' => null];

if ($_SERVER['REQUEST_METHOD'] == 'GET' && array_key_exists('location', $_GET) && !empty($_GET['location'])) {
	$location = $_GET['location'];
	$url = "https://query.yahooapis.com/v1/public/yql";
	$data = array("q" => "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"$location\")", "format" => "json");
	
	$call = null;
	$filename = 'cache/'.$location.'.json';

	if (file_exists($filename)) {
		$changedtime = filectime($filename);
		$now = time();
		//echo ($now - $changedtime);
		// if file has changed within 60*60*12 seconds pick the cached file
		if ($now - $changedtime < 60*60*12) {
			$obj->results = json_decode(file_get_contents($filename));
			$obj->message = 'Found cached data';
		}
	}
	//if results are false call the API
	if (!$obj->results) {
		$call = CallAPI('GET', $url, $data);
	}
	// if the call was successful, get the content 
	if($call){
		$json_obj = json_decode($call);
		$obj->results = $json_obj->query->results;
		if ($obj->results) {
			$obj->message = 'Found something';
			// save the content to a file
			// remember to set the set the permissions of the cache directory
			file_put_contents('cache/'.$location.'.json', json_encode($obj->results));
		}else{
			$obj->message = 'Found nothing';
		}
	}
}

// Method: POST, PUT, GET etc
// Data: array("param" => "value") ==> index.php?param=value
function CallAPI($method, $url, $data = false)
{
	$curl = curl_init();
	$headers = array("Cache-Control: no-cache","Pragma: no-cache"); 
	switch ($method)
	{
		case "POST":
			curl_setopt($curl, CURLOPT_POST, 1);
			if ($data)
				curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
			break;
		case "PUT":
			curl_setopt($curl, CURLOPT_PUT, 1);
			break;
		default:
			if ($data)
				$url = sprintf("%s?%s", $url, http_build_query($data));
	}
	
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers); 

	curl_setopt($curl, CURLOPT_URL, $url);

	//curl_setopt($curl, CURLOPT_HEADER, TRUE);
	//$responseheaders = curl_exec($curl);

	//return body of the request
	curl_setopt($curl, CURLOPT_HEADER, FALSE);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	$result = curl_exec($curl);

	curl_close($curl);

	return $result;
}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>Weather</title>
		<meta charset="utf-8"/>
	</head>
	<body>
		<form name="searchweather">
			<input name="location" type="text" value="<?php echo $location; ?>" />
			<input type="submit" />
		</form>
		<?php if($obj->message) { ?>
			<p><?php echo $obj->message; ?></p>
		<?php } ?>
		<div id="result">
			<?php if($obj->results) { ?>
				<?php foreach ($obj->results as $res) { ?>
					<div class="forcast">
						<h2><?php echo $res->title; ?></h2>
						<p>Date: <?php echo $res->item->condition->date; ?></p>
						<p>Temperature: <?php echo $res->item->condition->temp; ?> °<?php echo $res->units->temperature; ?></p>
						<p>Condition: <?php echo $res->item->condition->text; ?></p>
					</div>
				<?php } ?>
			<?php } ?>
		</div>
		<footer>
			<div>
				<a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29"/> </a> 
			</div>
		</footer>
	</body>
</html>