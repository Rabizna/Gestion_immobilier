<?php
require_once 'config.php';

$sql = "SELECT NumLog, NomLog FROM logement WHERE NumLog NOT IN (SELECT NumLog FROM achat)";
$result = mysqli_query($conn, $sql);

$logements = array();

while ($row = mysqli_fetch_assoc($result)) {
    $logements[] = $row;
}

$jsonData = json_encode($logements);

header('Content-Type: application/json');
echo $jsonData;
?>
