<?php
require_once 'config.php';

$sql = "SELECT c.Nom, c.Prenoms, c.Adresse, l.NomLog, l.PrixLog
FROM client c
JOIN logement l ON c.NumCli = l.NumCli;
";

$result = mysqli_query($conn, $sql);

$logements = array();

while ($row = mysqli_fetch_assoc($result)) {
    $logements[] = $row;
}

$jsonData = json_encode($logements);

header('Content-Type: application/json');
echo $jsonData;
?>
