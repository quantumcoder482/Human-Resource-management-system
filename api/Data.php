<?php
require_once('Connection.php');
// $mysqli=mysqli_connect('localhost', 'root', '', 'buzzbe6_dominee');

class Data{
	
	public function profile_details()
	{
	
	$mysqli=mysqli_connect('localhost', 'root', '', 'buzzbe6_dominee');
	$query = "SELECT * FROM profile"; 
       $result = @mysqli_query($mysqli, $query) or die("SQL Error 1: " . mysqli_error());
       $num_rows=mysqli_num_rows($result);
	   if($num_rows>0)
	   {
	     while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
           {
              $query_result[] = array(
			   'title' => $row['title'],
			   'owner' => $row['owner'],
			   'contact' => $row['contact'],
			   'email' => $row['email'],
			   'address' => $row['address'],
			   'product_disclaimer' => $row['product_disclaimer'],
			   'delivery_disclaimer' => $row['delivery_disclaimer'],
			);
          }
		return json_encode($query_result);
	}
   } 
   
   
   public function order_by_id()
   
	{
		$mysqli=mysqli_connect('localhost', 'root', '', 'buzzbe6_dominee');
    	$query = "SELECT * FROM myorder order by id DESC limit 1"; 
            $result = @mysqli_query($mysqli, $query) or die("SQL Error 1: " . mysqli_error());
            $num_rows=mysqli_num_rows($result);
	        if($num_rows>0)
	         {
	            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
               {
              $query_result = array(
			   'id' => $row['id'],
			//    'order_num' => $row['order_num'],
               'items' => $row['items'],
			   'quantity' => $row['quantity'],
			   'user_id' => $row['user_id'],
			   'contact_name' => $row['contact_name'],
			   'contact_number' => $row['contact_number'],
			   'contact_address' => $row['contact_address'],
			   'bill_amount' => $row['bill_amount'],
			   'payable_amount' => $row['payable_amount'],
			   'order_comment' => $row['order_comment'],
			   'discount' => $row['discount'],
			   'prices' => $row['prices'],
			   'item_names' => $row['item_names'],
			   'date' => $row['date'],
			   'cgst' => $row['cgst'],
			   'sgst' => $row['sgst'],
			   'order_cgst' => $row['order_cgst'],
			   'order_sgst' => $row['order_sgst'],
			  );
          }
		return $query_result;
	}
   }   

    public function view_by_id($field,$table,$condition,$value)
	{
	$mysqli=mysqli_connect('localhost', 'root', '', 'buzzbe6_dominee');
	$query = "SELECT $field FROM $table where $condition='$value'"; 
       $result = @mysqli_query($mysqli,$query) or die("SQL Error 1: " . mysqli_error());
       $num_rows=mysqli_num_rows($result);
	   $responce=mysqli_fetch_array($result);
	   if($num_rows>0){
	   		return $responce;
	   }
   }
        
  
}

?>