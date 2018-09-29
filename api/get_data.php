<?php
  require_once('Data.php');
  $object= new Data;
  header('Content-type: application/json');
  
    if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){
		
		 $contact=$object->test_input($_POST['contact']);
		 $fcm=$object->test_input($_POST['fcm']);
		 $name=$object->test_input($_POST['name']);
		 $email=$object->test_input($_POST['email']);
		 $area=$object->test_input($_POST['area']);
		 
        if(isset($_POST['contact']) && !empty($_POST['fcm']) && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['area'])){
		
		    if(!empty($contact)){	
			       
				   $user1=$object->user_by_contact($contact);
			       $user=json_decode($user1);
			       
			   if(empty($user)) {
					     	
					        $fields="contact,fcm,area,email,name";
	                        $values="'$contact','$fcm','$area','$email','$name'";
  					        $insert=$object->insert_into_databse_table('user',$fields,$values);
							
							$user1=$object->user_by_contact($contact);
			                $user=json_decode($user1);
					  
				           }
						   
				 } else {
					 
						    $fields="contact,fcm,area,email,name";
	                        $values="'$contact','$fcm','$area','$email','$name'";
  					        $insert=$object->insert_into_databse_table('user',$fields,$values);
							
							 $user1=$object->user_by_fcm($fcm);
			                 $user=json_decode($user1);
							
			            }
			                 
							      $profile1=$object->profile_details();
			                      $profile=json_decode($profile1);
			       
			                      $favourites1=$object->user_favourites($user[0]->id);
			                      $favourites=json_decode($favourites1);
								  
								  $address1=$object->user_address($user[0]->id);
			                      $address=json_decode($address1);
				      
				                  $category1=$object->category();
			                      $category=json_decode($category1);
				       
					              $subcategory1=$object->subcategory();
			                      $subcategory=json_decode($subcategory1);
				   
				                  $area1=$object->area();
			                      $area=json_decode($area1);
								  
								  if(!empty($profile[0]->load_data_once)){
					   
					                    $product1=$object->products();
			                            $product=json_decode($product1);
										
								  }else{
									  
									     $product=null;  
								  }
					              
								  $banner1=$object->banners();
			                      $banner=json_decode($banner1);
					  	          
						    	  $slot1=$object->delivery_slots();
			                      $slot=json_decode($slot1);
					  	    
									   
				 $response = array('category' => $category, "subcategory" => $subcategory, "area" => $area, "product"=>$product, "profile" => $profile, "banner" => $banner, "slot" => $slot ,"user" => $user, "favourites" => $favourites,"address" =>$address);
				      $message=json_encode($response);
					  
					  
					  } else {
					   $response = array('response' => 'insufficient data' );
  				    	$message=json_encode($response);
			      	}
					
				      
				 } else {
					   $response = array('response' => 'error' );
  				    	$message=json_encode($response);
			      	}
						   
				           echo $message;
?>