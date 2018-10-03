<?php

class DatabaseConnect
{
    public function __construct($Db_Host, $Db_UserName, $Db_Password, $Db_name){

      if(!@$this->Connect($Db_Host, $Db_UserName, $Db_Password, $Db_name)){

        echo"connection Failed";

      }

    }

    public function connect($Db_Host, $Db_UserName, $Db_Password, $Db_name){

      if(!mysqli_connect($Db_Host, $Db_UserName, $Db_Password, $Db_name)){

        return false;

      }else {
        return true;
      }
  }
}

 // $con_onject=new DatabaseConnect('localhost','buzzbtfx_buzzbee','buzzbee123');
 $con_object=new DatabaseConnect('localhost','root','','m89caterersb_hrmanagedb');
 $mysqli=$con_object->connect('localhost','root','','m89caterersb_hrmanagedb');
 $mysqli=mysqli_connect('localhost', 'root', '', 'm89caterersb_hrmanagedb');
?>