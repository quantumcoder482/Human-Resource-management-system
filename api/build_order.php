<?php
require_once('Data.php');
require('fpdf.php');
$service=new Data;
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$detail=$service->order_by_id();
	define("ORDER_ID", $detail['id']);
	$profile1=$service->profile_details();
	$profile=json_decode($profile1);		
		
// Instanciation of inherited class
class PDF extends FPDF
{
	// Page header
	function Header()
	{
		$object=new Data;
		$detail=$object->order_by_id(ORDER_ID);
		
		$profile1=$object->profile_details();
		$profile=json_decode($profile1);		
		
		//$this->Cell(10,1,'Page '.$this->PageNo().'/{nb}',0,0,'L');
		
		$this->SetFont('Arial','B',10);
		$this->SetX(90);
		$this->Cell(5,0,'GST Invoice',0,1);
		
		$this->SetFont('Arial','I',8);
		$this->SetX(150);
		$this->Cell(5,0,'(ORIGINAL FOR RECIPIENT)',0,1);
		
		$this->Line(10, 15, 200, 15);
		$this->Line(10, 15, 10, 60);
		$this->Line(200, 15, 200, 60);
		$this->Line(120, 15, 120, 60);
		$this->Line(10, 40, 120, 40);
		$this->Line(10, 60, 200, 60);
		
		$this->SetX(10);
		
		$this->SetFont('Arial','B',10);
		// Title
		$this->Cell(0,20,$profile[0]->title,0,1);
		$this->SetFont('Arial','I',8);
		$this->Cell(0,-12,'Panama Chowk, Gandhi Nagar',0,1);
		$this->Cell(0,18,'Jammu,Jammu & Kashmir-190001',0,1);
		$this->Cell(0,-12,'Contact:'.$profile[0]->contact,0,1);
		$this->Cell(0,18,'GSTIN: 22AHEPB2676G175',0,1);
		$this->Cell(0,-12,'E-mail:' .$profile[0]->email,0,1);
		


		$this->SetFont('Arial','B',10);
		$this->SetY(43);

		$this->MultiCell(120,0,'Buyer: '.$detail['contact_name'],0,1);

		$this->SetFont('Arial','I',8);
		$this->SetY(45);

		$this->MultiCell(120,3,'ADDRESS:'.$detail['contact_address'],0,1);
		$this->Cell(0,4,''.'MOBILE: '.$detail['contact_number'],0,1);


		
		
		$this->Line(120, 28, 200, 28);
		$this->Line(120, 38, 200, 38);
		$this->Line(120, 50, 200, 50);
		$this->Line(120, 60, 200, 60);
		
		$this->Line(160, 15, 160, 50);
		
		$this->SetY(18);
		$this->Cell(128,0,'Invoice No.',0,1,'R');
		
		$this->SetFont('Arial','B',10);
		$this->Cell(118,10,''.ORDER_ID,0,1,'R');
		
		$this->SetFont('Arial','I',8);
		$this->Cell(160,-20,'Dated',0,1,'R');
		
		$mydate=explode(" ",$detail['date']);
		$date1=date_create($mydate[0]);
		$date=date_format($date1,"d M Y");

		
		$this->SetFont('Arial','B',10);
		$this->Cell(172,30,''.$date,0,1,'R');
		
		$this->SetFont('Arial','I',8);
		$this->Cell(183,-15,'Mode/Terms of Payment',0,1,'R');
		
		$this->Cell(130,35,'Suppliers Ref',0,1,'R');
		$this->Cell(177,-35,'Other Reference(s)',0,1,'R');
		$this->Cell(134,60,'Terms of Delivery',0,1,'R');
		
		
	}

	// Page footer
	function Footer()
	{
		// Position at 1.5 cm from bottom
		//$this->SetY(-15);
	//	 // Arial italic 8
	//    $this->SetFont('Arial','I',8);
	//    // Page number
	//	$this->Cell(0,10,'This is a Computer Generated Invoice. ',0,0,'L');
	//    $this->Cell(-180,0,'SUBJECT TO RAJNANDGAON JURISDICTION ',0,0,'C');
	//    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'R');
	//	//$this->Cell(0,10,'Like karyanawala on facebook for daily offers ',0,0,'R');
	//	$this->Line(10, 250, 200, 250);
	//	$this->Line(10, 275, 200, 275);
	//	   
	//	
	//	  $this->SetY(-45);
	//	 
	//	 $this->Cell(0,10,'Declaration ',0,0,'L');
	//	 
	//	 $this->SetX(10);
	//	 $this->Cell(0,20,'We declare that this invoice shows the actual price of the goods',0,0,'L');
	//     $this->SetX(10);
	//	 
	//	 $this->Cell(100,30,'described and that all particulars are true and correct. ',0,0,'L');
	//    
	//	 $this->SetX(110);
	//	 $this->SetY(-55);
	//	 
	//	 $this->Cell(0,30,'for MobileMitra ',0,0,'R');
	//	 
	//	 $this->SetFont('Arial','I',6);
	//   
	//     $this->Cell(0,50,'Authorised Signatory ',0,0,'R');
	} 

}

// Instanciation of inherited class
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
	   
$pdf->SetFont('Arial','I',8);
//$pdf->SetX(-145);
$pdf->Sety(55);
 
 
$htmlTable='<TABLE>
<TR>
<TD>S.No.</TD>
<TD>Description of Item</TD>
<TD>GST</TD>
<TD>Qty</TD>
<TD>Price</TD>
<TD>Total</TD>
</TR>';

$no=1;
$i=0;
$g_total=0;
$ac=0;
$tmrp=0.0;    

	
	$items=$detail['item_names'];
	$product_names=explode(',%,%',$items,-1);
	
	$price=$detail['prices'];
	$prices=explode(',',$price,-1);
	
	$quantity=$detail['quantity'];
	$quantity1=explode(',',$quantity,-1);
	
	$cgst1=$detail['cgst'];
	$cgst=explode(',',$cgst1,-1);
	
	$sgst1=$detail['sgst'];
	$sgst=explode(',',$sgst1,-1);
	
	
	if(!empty($product_names))
	{
	foreach($product_names as $row)
	{ 
	
	$item_gst=$cgst[$i]+$sgst[$i];
	 
$htmlTable.='
<TR>
<TD>'.$no.'</TD>
<TD>'.$row .'</TD>
<TD>'.$item_gst .'%'.'</TD>
<TD>'.$quantity1[$i].'</TD>
<TD>'.$prices[$i].'</TD>
<TD>'.$quantity1[$i] * $prices[$i].'</TD>
</TR>';

$ac=$quantity1[$i]*$prices[$i];
$g_total = $g_total + $ac;
$no++;
$i++;
}
} 
 

$htmlTable.='<TR>

<TD></TD>
<TD bgcolor="#D0D0FF">Sub Total</TD>
<TD></TD>
<TD></TD>
<TD></TD>
<TD>'.$detail['bill_amount'].'</TD>
</TR>';

if($detail['discount']){

$htmlTable.='<TR>

<TD></TD>
<TD>Discount</TD>

<TD></TD>
<TD></TD>
<TD> </TD>
<TD>'.$detail['discount'].'</TD>
</TR>';
}

$htmlTable.='<TR>

<TD></TD>
<TD>CGST</TD>
<TD></TD>
<TD></TD>
<TD></TD>
<TD>'.$detail['order_cgst'].'</TD>
</TR>';

$htmlTable.='<TR>

<TD></TD>
<TD>SGST</TD>
<TD></TD>
<TD></TD>
<TD></TD>
<TD>'.$detail['order_sgst'].'</TD>
</TR>';

$htmlTable.='<TR>

<TD></TD>
<TD>Total(Roundoff)</TD>
<TD></TD>
<TD></TD>
<TD></TD>
<TD>'.round($detail['payable_amount']).'</TD>
</TR>';

$htmlTable.='</TABLE>';
$pdf->WriteHTML2("$htmlTable");
   
   
     $pdf->Cell(0,10,'Declaration ',0,0,'L');
	 
	 $pdf->SetX(10);
	 $pdf->Cell(0,20,'We declare that this invoice shows the actual price of the goods',0,0,'L');
     $pdf->SetX(10);
	 
	 $pdf->Cell(100,30,'described and that all particulars are true and correct. ',0,0,'L');
    
	 //$pdf->SetX(110);
	 //$pdf->SetY(-55);
	 
	 $pdf->Cell(0,10,'for Dominee ',0,0,'R');
	 
	 $pdf->SetFont('Arial','I',6);
   
     $pdf->Cell(0,30,'Authorised Signatory ',0,0,'R');

    // $pdf->SetY(-15);
	 // Arial italic 8
    $pdf->SetFont('Arial','I',8);
    // Page number
	$pdf->Cell(-160,45,'SUBJECT TO JAMMU JURISDICTION ',0,0,'C');
     
	 $pdf->SetX(10);
	$pdf->Cell(0,55,'This is a Computer Generated Invoice. ',0,0,'L');
    
	//$this->Cell(0,10,'Like karyanawala on facebook for daily offers ',0,0,'R');
	//$pdf->Line(10, 250, 200, 250);
	//$pdf->Line(10, 275, 200, 275);
	   
	
	 //$pdf->SetY(-45);
	 
	 
//$pdf->Output();
$filename="../invoice/".$detail['id'].".pdf";
$pdf->Output($filename,'F');

	
?>