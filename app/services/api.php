<?php
    require_once("Rest.inc.php");
	class API extends REST {
	
		public $data = "";
		

		const DB_SERVER = "localhost";
		const DB_USER = "root";                
		const DB_PASSWORD = "";
		const DB = "m89caterersb_hrmanagedb";

		// const DB_SERVER = "localhost";
		// const DB_USER = "m89caterersb_hrmanageuser";
		// const DB_PASSWORD = "buzzbee123";
		// const DB = "m89caterersb_hrmanagedb";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		 */
		 
		   private function dbConnect(){
             $this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		 }
		
		
		/*
		 * Dynmically call the method based on the query string
		 */
		 
		 public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		 }
				
		/*
		 * ADMIN TRANSACTION
		 */
		 		
		private function login(){
			
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
		
			$vendor = json_decode(file_get_contents("php://input"),true);
			$username = $vendor["username"];
			$password = $vendor["password"];
			if(!empty($username) and !empty($password)){ // empty checker
				$query="SELECT * FROM user WHERE username = '$username' AND password = '".md5($password)."' LIMIT 1";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();
					$this->response($this->json($result), 200);
				}
				$this->response('', 204);	// If no records "No Content" status
			}
			$error = array('status' => "Failed", "msg" => "Invalid username or Password");
			$this->response($this->json($error), 400);
		}  
		
		
		private function users(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT * FROM user WHERE id=$id";
			$this->get_one($query);
		}

		  private function updateUsers(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$users = json_decode(file_get_contents("php://input"),true);
		
			$id = (int)$users['id'];
			
			// $user = $users['profile'];
			$password = $users['user']['password'];
			$users['user']['username']=mysqli_real_escape_string($this->mysqli, $users['user']['username']);
			$users['user']['profile_name']=mysqli_real_escape_string($this->mysqli, $users['user']['profile_name']);
			$users['user']['address']=mysqli_real_escape_string($this->mysqli, $users['user']['address']);
			
			if($password == '*****'){
				$column_names = array('id','username','profile_name','contact','email','address','permission');
			}else{
				$users['user']['password'] = md5($password);
				$column_names = array('id','username','profile_name','contact','email','address','permission','password');
			}
			$table_name = 'user';
			$this->post_update($id, $users, $column_names, $table_name);
		} 
		
		/*
		 * Profiles
		 */

		private function get_all_profile(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT * FROM user";
			$this->get_list($query);
		}
		
		private function delete_profile(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'user';
			$this->delete_one($id, $table_name);
		}
		
		private function get_all_pages(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query = "SELECT * from pages ORDER BY id ASC";
			$this->get_list($query);
		}

		private function insert_user(){
			if($this->get_request_method() != 'POST'){
				$this->response('',406);
			}
			$user = json_decode(file_get_contents("php://input"),true);
			// print_r($user);
			$password = $user['password'];
			$user['username']=mysqli_real_escape_string($this->mysqli, $user['username']);
			$user['profile_name']=mysqli_real_escape_string($this->mysqli, $user['profile_name']);
			$user['address']=mysqli_real_escape_string($this->mysqli, $user['address']);
			
			if($password == ''){
				$column_names = array('id', 'username','profile_name','contact','email','address','permission');
			}else{
				$user['password'] = md5($password);
				$column_names = array('id', 'username','profile_name','contact','email','address','permission','password');
			}
			$table_name = 'user';
			$this->post_one($user, $column_names, $table_name);
		}


		/*
		 * COMMON TRANSACTION
		 */
		   
	    private function Inline_Update(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$table =$this->_request['table'];
			$col =$this->_request['col'];
			$value =$this->_request['value'];
			$id =$this->_request['id'];
			
			$query="UPDATE $table SET $col= '$value' WHERE id=$id";
			$this->update_one($query);
		}
		
		
		private function Stock_Update(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id =$this->_request['id'];
			$value =$this->_request['value'];
			
			$query="UPDATE ingredients SET stock=stock - '$value' WHERE id=$id";
			$this->update_one($query);
		}
		
		
		private function get_last_priority(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$table =$this->_request['table'];
			
			$query="select priority from $table order by priority DESC limit 1";
			$this->get_list($query);
		}

     	private function GetCounter(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query=" SELECT (SELECT COUNT(*) FROM category ) as table1Count, 
			(SELECT COUNT(*) FROM subcategory) as table2Count, 
			(SELECT COUNT(*) FROM product) as table3Count, 
			(SELECT COUNT(*) FROM customer ) as table4Count"; 
			$this->get_list($query);
		}
		
		
		   /* get_ordertype */

		private function get_ordertype(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT * FROM `order_type`";
			$this->get_list($query);
		}		
		

		/*
		 * STOCK TRANSACTION
		 */		
		 
		 
		private function get_Sales_Report(){	
		
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}	
			$sdate = $this->_request['sdate'].' 00:00:00';
			$edate = $this->_request['edate'].' 23:59:59';
			$type = $this->_request['type'];
			if($type == 0)
				$query="SELECT SUM(payable_amount) as total,MIN(payable_amount) as min, MAX(payable_amount) as max, COUNT(id) as count, SUM(order_cgst) as cgst, SUM(order_sgst) as sgst from myorder WHERE date >='$sdate' and date <= '$edate'";
			else 
				$query="SELECT SUM(payable_amount) as total,MIN(payable_amount) as min, MAX(payable_amount) as max, COUNT(id) as count, type, SUM(order_cgst) as cgst, SUM(order_sgst) as sgst from myorder WHERE date >='$sdate' and date <= '$edate' and type = '$type'";
			$this->get_list($query);
		}
		
		private function get_Day_Sales_Report(){	
		
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}	
			$sdate = $this->_request['theday'].' 00:00:00';
			$edate = $this->_request['theday'].' 23:59:59';
			$query="SELECT * from myorder WHERE date >='$sdate' and date <= '$edate' ORDER BY date DESC";
			$this->get_list($query);
		}		
		
		private function get_ingredient_stock_history(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$id = (int)$this->_request['id'];
			$query="select s.*, i.title, i.stock, i.unit from stock s, ingredients i where s.ingredient='$id' and s.ingredient=i.id order by datetime DESC";
			$this->get_list($query);
		}		

		private function get_ingredient_myone_stock_history(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT a.*, MAX(b.datetime) AS lasttime, b.quantity, b.stock_previous, b.remarks FROM `ingredients` a LEFT JOIN `stock`b ON a.id = b.ingredient GROUP BY a.id ORDER BY a.id ASC ";
			$this->get_list($query);
		}	

		private function get_ideal_stockhistory(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT a.items AS product_id, a.quantity FROM `myorder` a WHERE DATE >= CAST(CURRENT_TIMESTAMP AS DATE)";// today order list
			$this->get_list($query);
		}	

		private function get_consumption(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT * FROM `consumption`";// consumption
			$this->get_list($query);
		}

		private function get_consumption_byproduct(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT * FROM `consumption` WHERE product = '$id'";// consumption
			$this->get_list($query);
		}

		private function insert_stock(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$stock = json_decode(file_get_contents("php://input"),true);
			if($stock['remarks']){
				$stock['remarks']=mysqli_real_escape_string($this->mysqli, $stock['remarks']);
			}
			$column_names = array('ingredient', 'type', 'quantity', 'remarks', 'stock_previous', 'function', 'vendor_id', 'booking_id');
			$table_name = 'stock';
			$this->post_one($stock, $column_names, $table_name);
		}

		private function updateopening(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$sql = "UPDATE `ingredients`, ( SELECT t.quantity, t.ingredient, t.stock_previous FROM (SELECT * , MAX(DATETIME) AS sss FROM `stock` GROUP BY ingredient ) r INNER JOIN `stock` t ON r.ingredient = t.ingredient AND r.sss = t.datetime) v SET `ingredients`.stock = v.quantity WHERE `ingredients`.id = v.ingredient";
			if ($this->mysqli->query($sql)) {	
				$msg 	= " Opening updated successfully";
				$resp = array('status' => 'success', "msg" => $msg, "data" => "");
				$this->response($this->json($resp), 200);
			} else {
				$this->response('',204);
			}
		}

		private function insert_stockhistory(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$stock = json_decode(file_get_contents("php://input"),true);

			$insert_Array = array();
			$column_names = array('ingredient', 'quantity', 'datetime', 'stock_previous', 'remarks');
			$table_name = 'stock';

			foreach ($stock as $item){
				if (array_key_exists("deliver",$item) || array_key_exists("ending",$item)){
					$item['ingredient'] = $item['id'];
					if(!array_key_exists("deliver",$item)) $item['quentity'] = $item['stock'];
					else $item['quantity'] = $item['deliver']+$item['stock'];
					if(!array_key_exists("ending",$item)) $item['quantity'] = $item['quantity'];
					else $item['quantity'] = $item['ending'];
					$item['stock_previous'] = $item['stock'];
					$item['remarks']=mysqli_real_escape_string($this->mysqli, $item['remarks']);
					$item['datetime'] = date("Y-m-d h:i:s");
					$insert_Array[] = $item;
				}
			}
			$this->post_multi($insert_Array, $column_names, $table_name);
		}

		private function update_stock(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$stock = json_decode(file_get_contents("php://input"),true);
			$id = (int)$stock['id'];
			$stock['stock']['remarks']=mysqli_real_escape_string($this->mysqli, $stock['stock']['remarks']);
			$column_names = array('ingredient', 'quantity', 'remarks','stock_previous');
			$table_name = 'stock';
			$this->post_update($id, $stock, $column_names, $table_name);
		}
		
		
		// Stock 
		private function get_stockhistory(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			// $query="SELECT a.items AS product_id, a.quantity FROM `myorder` a WHERE DATE >= CAST(CURRENT_TIMESTAMP AS DATE)";// today order list
			$query="SELECT a.*, b.title, b.unit FROM `stock` a LEFT JOIN `ingredients` b ON a.ingredient = b.id WHERE a.status != '0' GROUP BY a.id ORDER BY a.id DESC ";
			$this->get_list($query);
		}

		private function get_booking_sum_byid(){
			if($this->get_request_method() != 'GET'){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$query = "SELECT SUM(a.quantity) as total, a.ingredient, b.stock FROM `stock` a LEFT JOIN `ingredients` b ON a.ingredient = b.id WHERE a.ingredient = '$id' and a.booking_id != '0' and a.status = '0'";
			$this->get_one($query);
		}

		
	    /*
		 * menu
		 */	

		private function insert_menu(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$myorder = json_decode(file_get_contents("php://input"),true);

			$myorder['item_names']=mysqli_real_escape_string($this->mysqli, $myorder['item_names']);
			
			$column_names = array('name','items', 'quantity', 'prices','item_names', 'total_price');
			$table_name = 'menu';
			$this->post_one($myorder, $column_names, $table_name);
		}

		private function get_menulist(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT * from menu"; 
			$this->get_list($query);
		}

		private function deleteMenu(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'menu';
			$this->delete_one($id, $table_name);
		}

	    /*
		 * ORDER TRANSACTION
		 */		
		 
		  
		private function my_orders(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT * from myorder"; 
			$this->get_list($query);
		 }
		 
		 
		 private function last_order_id(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$query="SELECT id from myorder order by id DESC limit 1"; 
			$this->get_list($query);
		 }
		  
		  	private function order_by_id(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT * FROM myorder where id='$id'";
			
			$this->get_list($query);
		}
		
		private function insert_order(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$myorder = json_decode(file_get_contents("php://input"),true);
			//print_r($myorder);
			$myorder['user_id'] = intval($myorder['user_id']);
			$myorder['contact_name']=mysqli_real_escape_string($this->mysqli, $myorder['contact_name']);
			$myorder['contact_address']=mysqli_real_escape_string($this->mysqli, $myorder['contact_address']);
			$myorder['order_comment']=mysqli_real_escape_string($this->mysqli, $myorder['order_comment']);
			$myorder['item_names']=mysqli_real_escape_string($this->mysqli, $myorder['item_names']);
			
			$column_names = array('items', 'quantity', 'prices','item_names','user_id','contact_name','contact_number','contact_address','bill_amount','payable_amount','order_comment','discount','cgst','sgst','order_cgst','order_sgst','type', 'customer_amount', 'totalpaid', 'dispute');
			$table_name = 'myorder';
			$this->post_one($myorder, $column_names, $table_name);
		}

		private function update_order_totalpaid(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$totalpaid = $this->_request['totalpaid'];	
			$query="UPDATE `myorder` SET totalpaid= '$totalpaid', customer_amount = 0, dispute = 0 WHERE id=$id";
			$this->update_one($query);
		}

		private function update_order_dispute(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$totalpaid = $this->_request['totalpaid'];	
			$query="UPDATE `myorder` SET dispute= 1 WHERE id=$id";
			$this->update_one($query);
		}

	    /*
		 *  Booking
		 */			

		private function insert_booking(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$booking = json_decode(file_get_contents("php://input"),true);
			// print_r($booking);
			$booking['user_id'] = intval($booking['user_id']);
			$booking['contact_name']=mysqli_real_escape_string($this->mysqli, $booking['contact_name']);
			$booking['contact_address']=mysqli_real_escape_string($this->mysqli, $booking['contact_address']);
			$booking['order_comment']=mysqli_real_escape_string($this->mysqli, $booking['order_comment']);
			$booking['item_names']=mysqli_real_escape_string($this->mysqli, $booking['item_names']);
			
			$column_names = array('items', 'quantity', 'item_names', 'user_id', 'contact_name', 'contact_number', 'contact_address', 'order_comment', 'discount', 'type', 'customer_amount', 'totalpaid', 'dispute', 'booking_date', 'booking_name', 'guest_num', 'reduce', 'total_price', 'booking_date1', 'booking_date2', 'booking_date3', 'booking_date4');
			$table_name = 'booking';
			$this->post_one($booking, $column_names, $table_name);
		}

		private function getBookingProduct(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$query="SELECT * FROM product  WHERE id IN ($id) ORDER BY FIELD(id,$id)";
			$this->get_list($query);
		} 

		private function getBookings(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from booking order by date desc";
			$this->get_list($query);
		}

		private function Update_BookingInfo(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$booking['booking']['customer_amount'] = $this->_request['customer_amount'];
			$booking['booking']['customer_amount_1'] = $this->_request['customer_amount_1'];
			$booking['booking']['dispute'] = $this->_request['dispute'];
			$booking['booking']['discount'] = $this->_request['discount'];
			$booking['booking']['discount_1'] = $this->_request['discount_1'];
			$booking['booking']['totalpaid'] = $this->_request['totalpaid'];
			$column_names = array('customer_amount','customer_amount_1','dispute','dispute_1','totalpaid', 'discount', 'discount_1');
			$table_name = 'booking';
			$this->post_update($id, $booking, $column_names, $table_name);
		}

		private function delete_Booking(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'booking';
			$this->delete_one($id, $table_name);
		}

	    /*
		 *  INGREDIENTS TRANSACTION
		 */		
		 
		private function ingredients(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from ingredients";
			$this->get_list($query);
		}
		
		private function ingredients_by_id(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			
			$query="SELECT * from ingredients where id='$id'";
			$this->get_list($query);
		}
		
		private function insert_ingredients(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$ingredients = json_decode(file_get_contents("php://input"),true);
			$ingredients['title']=mysqli_real_escape_string($this->mysqli, $ingredients['title']);
			$ingredients['unit']=mysqli_real_escape_string($this->mysqli, $ingredients['unit']);
			$column_names = array('title','unit','status');
			$table_name = 'ingredients';
			$this->post_one($ingredients, $column_names, $table_name);
		}		

		private function update_ingredients(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$ingredients = json_decode(file_get_contents("php://input"),true);
			$id = (int)$ingredients['id'];
			$ingredients['ingredients']['title']=mysqli_real_escape_string($this->mysqli, $ingredients['ingredients']['title']);
			$ingredients['ingredients']['unit']=mysqli_real_escape_string($this->mysqli, $ingredients['ingredients']['unit']);
			$column_names = array('title','unit','status','stock');
			$table_name = 'ingredients';
			$this->post_update($id, $ingredients, $column_names, $table_name);
		}

		
		/*
		 * INGREDIENTS CONSUMPTION TRANSACTION
		 */		
		 
		private function ingredient_consumption_by_product(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$product = $this->_request['product'];
			$query="SELECT c.*,i.title,i.unit,i.price FROM consumption c, ingredients i where c.ingredient=i.id and c.product='$product'";
			$this->get_list($query);
		} 
		
		
		private function active_ingredient_consumption_by_product(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$product = $this->_request['product'];
			$quantity = $this->_request['quantity'];
			$iteration = $this->_request['iteration'];
			$query="SELECT i.*,c.consumption, '$quantity' as quantity,'$iteration' as iteration FROM ingredients i, consumption c where i.id=c.ingredient and c.product='$product'";
			$this->get_list($query);
		} 
		
        private function insert_consumption(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$consumption = json_decode(file_get_contents("php://input"),true);
			$column_names = array('product','ingredient','consumption','status');
			$table_name = 'consumption';
			$this->post_one($consumption, $column_names, $table_name);
		}		

		private function update_consumption(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$consumption = json_decode(file_get_contents("php://input"),true);
			$id = (int)$consumption['id'];
			$column_names = array('product','ingredient','consumption','status');
			$table_name = 'consumption';
			$this->post_update($id, $consumption, $column_names, $table_name);
		}


		
	    /*
		 * CATEGORY TRANSACTION
		 */		
		 
		private function categories(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT DISTINCT c.id, c.title, c.priority, c.status FROM category c ORDER BY c.priority ASC";
			$this->get_list($query);
		} 
		
		
		private function category_title(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$id = $this->_request['id'];
			$query="SELECT id,title FROM category where id='$id'";
			$this->get_list($query);
		} 
		
		
		private function active_categories(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from category where status='1'";
			$this->get_list($query);
		}  
		
		private function ProductCategories(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$query="SELECT distinct c.id, c.c_title, c.c_icon, c.priority, c.is_banner, c.c_status FROM category c WHERE c.id IN ($id) ORDER BY FIELD(id,$id)";
			$this->get_list($query);
		}
		
		
		private function insertCategory(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$category = json_decode(file_get_contents("php://input"),true);
			$category['title']=mysqli_real_escape_string($this->mysqli, $category['title']);
			$column_names = array('title','priority','status');
			$table_name = 'category';
			$this->post_one($category, $column_names, $table_name);
		}		

		private function updateCategory(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$category = json_decode(file_get_contents("php://input"),true);
			$id = (int)$category['id'];
			$category['category']['title']=mysqli_real_escape_string($this->mysqli, $category['category']['title']);
			$column_names = array('title','priority','status');
			$table_name = 'category';
			$this->post_update($id, $category, $column_names, $table_name);
		}

		private function deleteCategory(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'category';
			$this->delete_one($id, $table_name);
		}
		
		
		/*
		 * SUBCATEGORY TRANSACTION
		 */		
		
		
		private function subcategory(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT distinct s.id, s.title, s.priority, s.status, s.category, c.title as category_name FROM subcategory s, category c WHERE s.category=c.id order by s.priority ASC";
			$this->get_list($query);
		}  
		
		 private function subcategory_title(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$id = $this->_request['id'];
			$query="SELECT title FROM subcategory where id='$id'";
			$this->get_list($query);
		} 
		
		
		private function subcat_by_cat(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$cat =$this->_request['cat'];
		     $query="select * from subcategory where category='$cat'";
			
			$this->get_list($query);
		}
		
		
		private function subcat_by_cat_mul(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$cat =$this->_request['cat'];
			$query="SELECT distinct s.id, s.title,s.status FROM subcategory s WHERE s.category IN ($cat)";
			$this->get_list($query);
		}
		
		
		private function subcat_by_ids(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ids =$this->_request['ids'];
			$query="SELECT distinct s.id, s.title FROM sub_category s WHERE s.id IN ($ids)";
			$this->get_list($query);
		}


		private function insertSubcat(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$subcat = json_decode(file_get_contents("php://input"),true);
			$subcat['title']=mysqli_real_escape_string($this->mysqli, $subcat['title']);
			$column_names = array('title', 'category', 'priority', 'status');
			$table_name = 'subcategory';
			$this->post_one($subcat, $column_names, $table_name);
		}
		

		private function updateSubcat(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$subcat = json_decode(file_get_contents("php://input"),true);
			$id = (int)$subcat['id'];
			$subcat['subcategory']['title']=mysqli_real_escape_string($this->mysqli, $subcat['subcategory']['title']);
			$column_names = array('title', 'category', 'priority', 'status');
			$table_name = 'subcategory';
			$this->post_update($id, $subcat, $column_names, $table_name);
		}
		

		private function deleteSubcat(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'sub_category';
			$this->delete_one($id, $table_name);
		}
		
		
		/*
		 * Product TRANSACTION
		 */		
		 
		private function products(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from product";
			$this->get_list($query);
		}
		
		
		 private function product_title(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$id = $this->_request['id'];
			$query="SELECT title FROM product where id='$id'";
			$this->get_list($query);
		} 
       
	    
		private function product_by_id(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			$id = $this->_request['id'];
			$query="SELECT * FROM product where id='$id'";
			$this->get_list($query);
		} 
        
		private function Product_by_key(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$key = $this->_request['key'];
			$query="SELECT distinct r.id, r.title, r.description FROM product r WHERE r.title LIKE '%$key%'";
			$this->get_list($query);
		}
		
		private function available_Product_by_key(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$key = $this->_request['key'];
			$query="SELECT distinct r.id, r.title, r.description FROM product r WHERE r.status=1 and r.title LIKE '%$key%'";
			$this->get_list($query);
		}

		private function getOrderProduct(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = $this->_request['id'];
			$query="SELECT * FROM product  WHERE id IN ($id) ORDER BY FIELD(id,$id)";
			$this->get_list($query);
		}
		
		private function Product_by_category(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$category = (int)$this->_request['category'];
			$query="SELECT * FROM product WHERE category IN ($category)";
			$this->get_list($query);
		}
		
		
	    private function Product_by_subcat(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$subcat = (int)$this->_request['subcat'];
			$query="SELECT * FROM product WHERE FIND_IN_SET($subcat, subcat)";
			$this->get_list($query);
		}
		
		private function insertProduct(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$product = json_decode(file_get_contents("php://input"),true);
			$product['title']=mysqli_real_escape_string($this->mysqli, $product['title']);
			$product['quantity']=mysqli_real_escape_string($this->mysqli, $product['quantity']);
			$column_names = array('category', 'subcat', 'title', 'quantity','status','description');
			$table_name = 'product';
			$this->post_one($product, $column_names, $table_name);
		}

		private function updateProduct(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$product= json_decode(file_get_contents("php://input"),true);
			$id = (int)$product['id'];
			$product['product']['title']=mysqli_real_escape_string($this->mysqli, $product['product']['title']);
			$product['product']['quantity']=mysqli_real_escape_string($this->mysqli, $product['product']['quantity']);
			$product['product']['description']=mysqli_real_escape_string($this->mysqli, $product['product']['description']);
		    $column_names = array('category', 'subcat', 'title', 'quantity','status','description');
			$table_name = 'product';
			$this->post_update($id, $product, $column_names, $table_name);
		}

		private function deleteProduct(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'product';
			$this->delete_one($id, $table_name);
		}
    
		/*
		 * Customer TRANSACTION
		 */		
		private function customers(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * FROM customer order by name ASC";
			$this->get_list($query);
		}

		private function customer_orders(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT myorder.*, order_type.name as type_name FROM myorder LEFT JOIN order_type ON myorder.type = order_type.id  order by date desc";
			$this->get_list($query);
		}
		  
		private function customer_by_id(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT distinct u.id, u.name, u.contact,  u.address FROM customer u where u.id='$id'";
			
			$this->get_list($query);
		}

	     
		private function insertCustomer(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$cust = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name', 'contact', 'email','address');
			$table_name = 'customer';
			$this->post_one($cust, $column_names, $table_name);
		}
		
		
		private function updateCustomer(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$cust = json_decode(file_get_contents("php://input"),true);
			$id = (int)$cust['id'];
			$column_names = array('name', 'contact', 'email','address');
		    $table_name = 'customer';
			$this->post_update($id, $cust, $column_names, $table_name);
		}


        private function deleteCustomer(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'customer';
			$this->delete_one($id, $table_name);
		}

		//employee

		private function get_employee(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT `employee`.*, `employee_catagory`.name AS catagory, sex.sex_n, blood.blood_n FROM employee LEFT JOIN `employee_catagory` ON `employee`.position = `employee_catagory`.id LEFT JOIN sex ON `employee`.sex = `sex`.id LEFT JOIN blood ON `employee`.blood = `blood`.id ORDER BY employee.id ASC";
			$this->get_list($query);
		}

		private function get_employee_active_withatt(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT `employee`.*, `employee_catagory`.name AS catagory, `employee_catagory`.id AS cata_id FROM employee LEFT JOIN `employee_catagory` ON `employee`.position = `employee_catagory`.id WHERE `employee`.active = 1 ORDER BY id ASC";
			$this->get_list($query);
		}

		private function getEmployee_active_catagorycount(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT `employee_catagory`.name AS name, COUNT(contact) AS y FROM employee LEFT JOIN `employee_catagory` ON `employee`.position = `employee_catagory`.id WHERE `employee`.active = 1 GROUP BY `employee`.position";
			$this->get_list($query);
		}

		private function get_employee_catagory(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}			
			$query="SELECT `employee_catagory`.*, b.num FROM employee_catagory LEFT JOIN (SELECT *,  COUNT(`employee`.id) AS num FROM `employee` GROUP BY `employee`.position) b ON `employee_catagory`.id = b.position ORDER BY employee_catagory.id ASC";
			$this->get_list($query);
		}

		private function insert_employee(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$emp = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name', 'contact', 'alternate', 'parent_f', 'parent_m', 'aadhaar', 'address', 'email', 'joindate', 'salary','incentives','blood','active','sex', 'leaved', 'position', 'advanced'); 
			$table_name = 'employee';
			$this->post_one($emp, $column_names, $table_name);
		}

		private function insert_employee_catagory(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$cata = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name');
			$table_name = 'employee_catagory';
			$this->post_one($cata, $column_names, $table_name);
		}
		
		private function get_date_attendance(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$date = $this->_request['date'];
			$query="SELECT * FROM attendance WHERE date='$date'";
			$this->get_list($query);
		}

		private function get_month_salary(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$month = $this->_request['month'];
			$query="SELECT * FROM salary WHERE month='$month'";
			$this->get_list($query);
		}		

		private function get_month_attendance(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$sdate = $this->_request['month'].'-01';
			$edate = $this->_request['month'].'-31';
			$query="SELECT * FROM attendance WHERE date >='$sdate' and date <= '$edate'";
			$this->get_list($query);
		}

		private function get_alldate_attendance(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * FROM attendance ORDER BY DATE DESC LIMIT 0, 5";
			$this->get_list($query);
		}

		private function insert_month_salary(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ite = $this->_request['ite'];
			$month = $this->_request['month'];
			$id = (int)$this->_request['id'];
			$query="INSERT INTO `salary` (month, $ite) VALUES ('$month', ',$id,')";
			$this->get_list($query);
		}
		
		private function update_month_salary(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ite = $this->_request['ite'];
			$att = $this->_request['att'];
			$id = (int)$this->_request['id'];			
			$query="UPDATE `salary` SET $ite= '$att' WHERE id=$id";
			$this->update_one($query);
		}
		
		private function update_month_salary_all(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ite = $this->_request['ite'];
			$fir = $this->_request['fir'];
			$sec = $this->_request['sec'];
			$thi = $this->_request['thi'];
			$id = (int)$this->_request['id'];			
			$query="UPDATE `salary` SET due = '$fir', paid = '$sec', dispute = '$thi' WHERE id=$id";
			$this->update_one($query);
		}			

		private function insert_date_attendance(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ite = $this->_request['ite'];
			$date = $this->_request['date'];
			$id = (int)$this->_request['id'];
			$query="INSERT INTO `attendance` (DATE, $ite) VALUES ('$date', ',$id,')";
			$this->get_list($query);
		}

		private function update_date_attendance(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$ite = $this->_request['ite'];
			$att = $this->_request['att'];
			$id = (int)$this->_request['id'];			
			$query="UPDATE `attendance` SET $ite= '$att' WHERE id=$id";
			$this->update_one($query);
		}

		
		/*
		 * Temporary Employee TRANSACTION
		 */		
		 private function temporarys(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * FROM temporary  order by name ASC";
			$this->get_list($query);
		}
		   
		private function temporary_by_id() {	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT distinct u.id, u.name, u.contact,  u.address FROM temporary u where u.id='$id'";
			
			$this->get_list($query);
		}
	     
		private function insertTemporary(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$emp = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name', 'contact', 'alternate', 'aadhaar', 'address', 'worktype_id', 'rate', 'join', 'leave');
			$table_name = 'temporary';
			$this->post_one($emp, $column_names, $table_name);
		}
		
		private function updateTemporary(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$emp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$emp['id'];
			$column_names = array('name', 'contact', 'alternate', 'aadhaar', 'address', 'worktype_id', 'rate', 'join', 'leave');
		    $table_name = 'temporary';
			$this->post_update($id, $emp, $column_names, $table_name);
		}

        private function deleteTemporary(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'temporary';
			$this->delete_one($id, $table_name);
		}
		
		 
		/*
		 * Temporary Payment TRANSACTION
		 */		
		 private function get_temp_pays(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * FROM `temporary_payment` LEFT JOIN `temporary` ON `temporary`.id = `temporary_payment`.temporary_id ORDER BY `temporary_payment`.id";
			$this->get_list($query);
		}
		   
		private function temporary_name_by_id() {	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT u.id, u.name FROM temporary u where u.id='$id'";
			
			$this->get_list($query);
		}
	     
		private function insertTempPayment(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$emp = json_decode(file_get_contents("php://input"),true);
			$column_names = array('temporary_id', 'pay_amount', 'date', 'state');
			$table_name = 'temporary_payment';
			$this->post_one($emp, $column_names, $table_name);
		}
		
		private function updateTempPayment(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$emp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$emp['id'];
			$column_names = array('temporary_id', 'pay_amount', 'date', 'state');
		    $table_name = 'temporary_payment';
			$this->post_update($id, $emp, $column_names, $table_name);
		}

		private function updateTempPayState() {
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$temp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$temp['id'];
			$state = (int)$temp['state'];

			$query = "UPDATE temporary_payment SET state='".$state."' WHERE id=".$id;

			// $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if ($this->mysqli->query($query)) {
				$status = "success";	
				$msg 	= "Vendor Payment State update successfully";
			} else {
				$status = "failed";	
				$msg 	= $this->mysqli->error.__LINE__;
			}
			$resp = array('status' => $status, "msg" => $msg, "data" => $temp);
			$this->response($this->json($resp),200);
		}		

        private function deleteTempPayment(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'temporary_payment';
			$this->delete_one($id, $table_name);
		}


		/*
		 * Vendor TRANSACTION
		 */		
		private function get_vendors(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT a.*, b.title FROM `vendor` a LEFT JOIN `ingredients` b ON b.id = a.ingredients_id ORDER BY a.id ASC";
			$this->get_list($query);
		}
		   
		private function vendor_by_id() {	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT u.id, u.name FROM vendor u where u.id='$id'";
			
			$this->get_list($query);
		}
	     
		private function insertVendor(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$emp = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name', 'contact', 'alternate', 'address', 'ingredients_id');
			$table_name = 'vendor';
			$this->post_one($emp, $column_names, $table_name);
		}
		
		private function updateVendor(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$emp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$emp['id'];
			$column_names = array('name', 'contact', 'alternate', 'address', 'ingredients_id');
			$table_name = 'vendor';
			$this->post_update($id, $emp, $column_names, $table_name);
		}

        private function deleteVendor(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'vendor';
			$this->delete_one($id, $table_name);
		}


		/*
		 * Vendor Payment TRANSACTION
		 */		
		private function get_vendor_pays(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT a.*, b.name, c.title FROM `vendor_payment` a LEFT JOIN `vendor` b ON b.id = a.vendor_id LEFT JOIN `ingredients` c ON c.id = a.ingredient_id";
			$this->get_list($query);
		}
		   
		private function vendor_pay_by_id() {	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$query="SELECT u.id, u.name FROM vendor_payment u where u.id='$id'";
			
			$this->get_list($query);
		}
	     
		private function insertVendorPay(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$emp = json_decode(file_get_contents("php://input"),true);
			$column_names = array('vendor_id', 'ingredient_id', 'amount', 'in_date', 'pay_date', 'pay_state', 'price', 'unit', 'paid_amount');
			$table_name = 'vendor_payment';
			$this->post_one($emp, $column_names, $table_name);
		}
		
		private function updateVendorPay(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			$emp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$emp['id'];
			$column_names = array('vendor_id', 'ingredient_id', 'amount', 'in_date', 'pay_date', 'pay_state');
			$table_name = 'vendor_payment';
			$this->post_update($id, $emp, $column_names, $table_name);
		}

		private function updateVendPayState() {
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$temp = json_decode(file_get_contents("php://input"),true);
			$id = (int)$temp['id'];
			$state = (int)$temp['state'];
			$paydate = $temp['pay_date'];

			$query = "UPDATE vendor_payment SET pay_state='".$state."', pay_date='$paydate' WHERE id=".$id;

			// $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if ($this->mysqli->query($query)) {
				$status = "success";	
				$msg 	= "Vendor Payment State update successfully";
			} else {
				$status = "failed";	
				$msg 	= $this->mysqli->error.__LINE__;
			}
			$resp = array('status' => $status, "msg" => $msg, "data" => $temp);
			$this->response($this->json($resp),200);
		}		

        private function deleteVendorPay(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			$table_name = 'vendor_payment';
			$this->delete_one($id, $table_name);
		}
		

		/* 
		 * VENDOR STOCK UPDATE
		 */
		private function get_vendor_stock_history(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			
			// $query="SELECT a.items AS product_id, a.quantity FROM `myorder` a WHERE DATE >= CAST(CURRENT_TIMESTAMP AS DATE)";// today order list
			$query="SELECT a.*, b.title, b.unit, c.name FROM `stock` a LEFT JOIN `ingredients` b ON a.ingredient = b.id LEFT JOIN `vendor` c ON a.vendor_id = c.id WHERE a.vendor_id != '0' GROUP BY a.id ORDER BY a.id DESC ";
			$this->get_list($query);
		}

		/*
		 * FILE TRANSACTION
		 */	
		 	
		 private function getBase64(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$data = file_get_contents("php://input");
			$type = 'jpg';
			$base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
			if(!empty($data)){
				$success = array('status' => "Success", "msg" => "Successfully.", "data" => $base64);
				$this->response($this->json($success), 200);
			}else{
				$this->response('',204);	// "No Content" status
			}
		}		

		private function uploadFileToUrl(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			//$file_name = $_POST['file_name'];
			print_r($_POST);
			$values = array_values($_POST);
			//$file_name = $_FILES['file_contents'];

			//$file_name = $this->_request['file_name'];

			$success = array('status' => "Success", "msg" => "Successfully.", "data" => null);
			$this->response($this->json($success), 200);
		}						
		
		/*
		 * ===================== API utilities # DO NOT EDIT ==============
		 */
		private function get_list($query){
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function get_one($query){
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0) {
				$result = $r->fetch_assoc();	
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function update_one($query){
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			
			
			$success = array('status' => "Success", "msg" => "Successfully.", "data" => null);
			$this->response($this->json($success), 200);
		}

		private function post_one($obj, $column_names, $table_name){
			$keys 		= array_keys($obj);
			$columns 	= '';
			$values 	= '';
			foreach($column_names as $desired_key){ // Check the recipe received. If blank insert blank into the array.
			  if(!in_array($desired_key, $keys)) {
			   	$$desired_key = '';
				}else{
					$$desired_key = $obj[$desired_key];
				}
				$columns 	= $columns.$desired_key.',';
				$values 	= $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
			//echo "QUERY : ".$query;
			if(!empty($obj)){
				//$r = $this->mysqli->query($query) or trigger_error($this->mysqli->error.__LINE__);
				if ($this->mysqli->query($query)) {
					$status = "success";	
			    	$msg 	= $table_name." created successfully";
			    	$insert_id = $this->mysqli->insert_id;
				} else {
					$status = "failed";	
			    	$msg 	= $this->mysqli->error.__LINE__;
				}
				$resp = array('status' => $status, "msg" => $msg, "data" => $obj, "insert_id" => $insert_id);
				$this->response($this->json($resp),200);
			}else{
				$this->response('',204);	//"No Content" status
			}
		}

		private function post_multi($objects, $column_names, $table_name){
			if(!empty($objects)){
				$count = 0;
				foreach($objects as $obj){
					$keys 		= array_keys($obj);
					$columns 	= '';
					$values 	= '';
					foreach($column_names as $desired_key){ // Check the recipe received. If blank insert blank into the array.
					  if(!in_array($desired_key, $keys)) {
					   	$$desired_key = '';
						}else{
							$$desired_key = $obj[$desired_key];
						}
						$columns 	= $columns.$desired_key.',';
						$values 	= $values."'".$$desired_key."',";
					}
					$query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
					if ($this->mysqli->query($query)) {

					} else {
						$count ++;
					}
				}
				if($count==0){	
						$msg 	= $table_name." inserted successfully";
						$resp = array('status' => 'success', "msg" => $msg, "data" => $objects);
						$this->response($this->json($resp), 200);
				}
			} else {
				$this->response('',204);	//"No update" status
			}
		}

		private function post_update($id, $obj, $column_names, $table_name){
		
			$keys = array_keys($obj[$table_name]);
			
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the recipe received. If key does not exist, insert blank into the array.
			  	if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $obj[$table_name][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE ".$table_name." SET ".trim($columns,',')." WHERE id=$id";
			
			if(!empty($obj)){
				// $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if ($this->mysqli->query($query)) {
					$status = "success";	
			    $msg 		= $table_name." update successfully";
				} else {
					$status = "failed";	
			    $msg 		= $this->mysqli->error.__LINE__;
				}
				$resp = array('status' => $status, "msg" => $msg, "data" => $obj);
				$this->response($this->json($resp),200);
			}else{
				$this->response('',204);	// "No Content" status
			}
		}		

		private function delete_one($id, $table_name){
			if($id > 0){				
				$query="DELETE FROM ".$table_name." WHERE id = $id";
				if ($this->mysqli->query($query)) {
					$status = "success";	
			    $msg 		= "One record " .$table_name." successfully deleted";
				} else {
					$status = "failed";	
			    $msg 		= $this->mysqli->error.__LINE__;
				}
				$resp = array('status' => $status, "msg" => $msg);
				$this->response($this->json($resp),200);
			}else{
				$this->response('',204);	// If no records "No Content" status
			}
		}

		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data, JSON_NUMERIC_CHECK);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>