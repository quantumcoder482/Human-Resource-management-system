<?php
	// require_once('Data.php');
	// $service=new Data;
	require('fpdf.php');
	$postdata = file_get_contents("php://input");
	$id = json_decode($postdata);

	const DB_SERVER = "localhost";
	const DB_USER = "root";                
	const DB_PASSWORD = "";
	const DB = "m89caterersb_hrmanagedb";

	// const DB_SERVER = "localhost";
	// const DB_USER = "m89caterersb_hrmanageuser";
	// const DB_PASSWORD = "buzzbee123";
	// const DB = "m89caterersb_hrmanagedb";
	
	$mysqli=mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB);

    $query = "SELECT * FROM booking order by id DESC limit 1"; 
    $result = @mysqli_query($mysqli, $query) or die("SQL Error 1: " . mysqli_error());
	$num_rows=mysqli_num_rows($result);
	if($num_rows>0){
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
			$query_result = array(
			'id' => $row['id'],
			'booking_name' => $row['booking_name'],
			'booking_date' => $row['booking_date'],
			'guest_num' => $row['guest_num'],
			'items' => $row['items'],
			'item_names' => $row['item_names'],
			'quantity' => $row['quantity'],
			'user_id' => $row['user_id'],
			'contact_name' => $row['contact_name'],
			'contact_number' => $row['contact_number'],
			'contact_address' => $row['contact_address'],
			'total_price' => $row['total_price'],
			'customer_amount' => $row['customer_amount'],
			'order_comment' => $row['order_comment'],
			'discount' => $row['discount'],
			);
		}
		// print_r($query_result);
		// exit;
	}
	$booking_date = date_create($query_result['booking_date']);
	$booking_date = Date_format($booking_date, "d/m/Y");


	$items = explode(",", $query_result['items'], -1);
	$item_names = explode(",%,%", $query_result['item_names'], -1);
	$quantity = explode(",", $query_result['quantity'], -1);
	// array_pop($items);
	// array_pop($item_names);
	// array_pop($quantity);
	$booking_items = array();
	$subcategories = array();
	$item_length = count($items);

	for($i=0;$i<=$item_length-1;$i++){
		$item = $items[$i];
		$query = "SELECT subcat FROM product WHERE id={$item}";
		$res = @mysqli_query($mysqli, $query) or die("SQL Error 1: " . mysqli_error());
		
		$subcat_string = "";

		if($res){
			$row = mysqli_fetch_assoc($res);
			$subcats = explode(",", $row['subcat'], -1);
			// array_pop($subcats);

			foreach ($subcats as $cat) {
				$query = "SELECT title FROM subcategory WHERE id={$cat}";
				$result = @mysqli_query($mysqli, $query) or die("SQL Error 1: " . mysqli_error());
				if($result){
					$r = mysqli_fetch_assoc($result);
					if($subcat_string === ""){
						$subcat_string .= $r['title'];
					} else {
						$subcat_string .= " + ".$r['title'];
					}
				}
			}
			$subcategories[] = $subcat_string;
		}

		$booking_item = [
			'subcat_name' => $subcat_string,
			'product_name' => $item_names[$i],
			'quantity' => $quantity[$i],
		];
		$booking_items[] = $booking_item;

	}

$subcategories = array_unique($subcategories);

	// print_r($booking_items);
	// print_r($subcategories);
	


	
// Instanciation of inherited class

class PDF extends FPDF
{
	// Page header
	function Header()
	{
		// $this->SetFont('Arial','B',25);
		// $this->SetX(30);
		// $this->Cell(5,0,'HEADER',0,1);
		$this->Image('../images/header2.jpg',0,0);
	}
}

// Instanciation of inherited class


	$pdf = new PDF('P','mm',array(105,148));
	$pdf->AliasNbPages();
	$pdf->SetAutoPageBreak(false);
	$pdf->AddPage();
		
	$pdf->SetFont('Arial','B',12);
	//$pdf->SetX(-145);
	$pdf->Sety(35);
	$pdf->Cell(0,8,$query_result['booking_name'],0,0,'C');
	
	$pdf->SetFont('Arial','B',8);
	$pdf->SetY(43); 
	$pdf->Cell(0,8,'Date: '.$booking_date,0,0,'L');

	$pdf->SetX(60);
	$pdf->Cell(0,8,'No of Guest: '.$query_result['guest_num'],0,0,'L');

	
	$pdf->SetY(49); 
	$pdf->Cell(0,8,'Customer Name: '.$query_result['contact_name'],0,0,'L');
	
	$pdf->SetX(60);
	$pdf->Cell(0,8,'Phone Number: '.$query_result['contact_number'],0,0,'L');
	
	$pdf->SetY(55); 
	$pdf->Cell(0,8,'Address: '.$query_result['contact_address'],0,0,'L');

	// Menu
	$pdf->SetY(62);
	$pdf->SetX(10);
	$pdf->Cell(0,8,'Menu List',0,0,'L');

	$pdf->SetFont('Arial','I',8);

	$height_space = 0;
	foreach($subcategories as $cat){

		$pdf->SetY(68+$height_space);
		$pdf->SetX(14);
		$pdf->Cell(0,8,$cat,0,0,'L');

		foreach ($booking_items as $item) {
			if($cat == $item['subcat_name']){
				$height_space += 3;
				$pdf->SetY(68+$height_space);
				$pdf->SetX(18);
				$pdf->Cell(0,10,$item['product_name'],0,0,'L');
				$pdf->SetX(80);
				$pdf->Cell(0,10,$item['quantity'],0,0,'L');
			}
		}
		$height_space += 6;
	}

	$pdf->SetFont('Arial','B',8);
	$pdf->SetY(119);
	$pdf->SetX(12);
	$pdf->Cell(0,8,'Total Amount: '.$query_result['total_price'],0,0,'L');
	
	$pdf->SetY(125);
	$pdf->SetX(12);
	$pdf->Cell(0,8,'Initial Paid: '.$query_result['customer_amount'],0,0,'L');
     
//$pdf->Output();
$filename="../booking/".$query_result['id'].".pdf";
$pdf->Output($filename,'F');

?>
