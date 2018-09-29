<?php
// Proovl API settings (token and API link)
// Reference href="https://www.proovl.com/sms-api
// enter your Proovl Api link and Proovl API token
$apilink = "***";
$token = "***"; 

// SMS sending request

$to = $_GET['to'];
$text = $_GET['text'];

	$url = "$apilink";

	$postfields = array(
		'token' => "$token",
		'to' => "$to",
		'text' => "$text"
	);

	if (!$curld = curl_init()) {
		exit;
	}

	curl_setopt($curld, CURLOPT_POST, true);
	curl_setopt($curld, CURLOPT_POSTFIELDS, $postfields);
	curl_setopt($curld, CURLOPT_URL,$url);
	curl_setopt($curld, CURLOPT_RETURNTRANSFER, true);

	$output = curl_exec($curld);

	curl_close ($curld);

 // Handle the response of SMS sending request

	$result = explode(';',$output);

	if ($result[0] == "Error") {
	
		$errmsg = "$result[1]";
		$array = array("708"=>"Incorrect Token", "700"=>"API disabled", "710"=>"Internal error");

		echo "Error message: ".$array["$errmsg"];

		die;

	} else {
		if (($result[2] > "") AND ($result[2] == "$token")) {
		
			echo "Message sent succesfully!";

		} else {

			echo "Token or Apilink not exist";
			die;

		}
	}
?>