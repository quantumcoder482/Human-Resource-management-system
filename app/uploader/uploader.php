<?php
	require_once("upload_res.php");

	// $target_dir 		= "../../uploads/";
	$target_dir 	= $_POST["target_dir"];
	$file_name 		= $_POST["file_name"];
	$target_file 	= $target_dir . $file_name;

	$res = new UploadRes();

  // Check if file already exists
	if (file_exists($target_file)) {
    unlink($target_file);
	}

	// Check if $uploadOk is set to 0 by an error
	if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    $success = array('status' => "success", "name" => $file_name);
		$res-> response($res->json($success), 200);
  } else {
    $success = array('status' => "failed", "msg" => "Failed uploading file");
		$res-> response($res->json($success), 200);
  }

?>