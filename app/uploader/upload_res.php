<?php
	class UploadRes {

		public $_allow = array();
		public $_content_type = "application/json";
		private $_code = 200;

		public function __construct(){}

		public function response($data, $status){
			$this->_code = ($status) ? $status : 200;
			$this->set_headers();
			echo $data;
			exit;
		}

		private function set_headers(){
			header("HTTP/1.1 ".$this->_code." ".$this->get_status_message());
			header("Content-Type:".$this->_content_type);
		}

		private function get_status_message(){
			$status = array(
				200 => 'OK',
				201 => 'Created',  
				204 => 'No Content',  
				404 => 'Not Found',  
				406 => 'Not Acceptable'
			);
			return ($status[$this->_code]) ? $status[$this->_code] : $status[500];
		}

		/*	Encode array into JSON */
		public function json($data){
			if(is_array($data)){
				return json_encode($data, JSON_NUMERIC_CHECK);
			}
		}

	}
?>