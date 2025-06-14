<?php
require_once 'config.php';

$sql = "SELECT agence.CodeAg, agence.LibAg, province.LibPro 
        FROM agence 
        INNER JOIN province ON agence.CodePro = province.CodePro";

$result = mysqli_query($conn, $sql);

$agences = array();

while ($row = mysqli_fetch_assoc($result)) {
    $agences[] = $row;
}

$jsonData = json_encode($agences);

header('Content-Type: application/json');
echo $jsonData;
?>

