<?php

class DatabaseConnect
{
  public function __construct($Db_Host, $Db_UserName, $Db_Password)
   {
    if(!@$this->Connect($Db_Host, $Db_UserName, $Db_Password))
	 {
      echo"connection Failed";
     }
    else if($this->Connect($Db_Host, $Db_UserName, $Db_Password))
	 {
 
	      mysql_select_db("m89caterersb_hrmanagedb");
     	 }
  }


 public function connect($Db_Host, $Db_UserName, $Db_Password)
 {
  if(!mysql_connect($Db_Host, $Db_UserName, $Db_Password))
   {
    return false;
   }
 else
  {
   return true;
  }
 }
}
 $con_onject=new DatabaseConnect('localhost','m89caterersb_hrmanageuser','buzzbee123');
  //$mysqli=$con_object->connect('localhost','root','');

?>