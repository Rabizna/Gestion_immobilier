<?php
require_once 'config.php';

$sql = "SELECT 
logement.NumLog, 
logement.NomLog, 
logement.PrixLog, 
cite.LibCite, 
logement.terrain,
logement.description,
logement.codeCite,
CASE 
    WHEN achat.NumLog IS NOT NULL THEN CONCAT('Occupé par ', client.NomCli) 
    ELSE 'Disponible' 
END AS Disponibilite
FROM 
logement 
INNER JOIN 
cite ON logement.codeCite = cite.codeCite
LEFT JOIN 
achat ON logement.NumLog = achat.NumLog
LEFT JOIN 
client ON achat.NumCli = client.NumCli";

$result = mysqli_query($conn, $sql);

$logements = array();

while ($row = mysqli_fetch_assoc($result)) {
    $logements[] = $row;
}

$jsonData = json_encode($logements);

header('Content-Type: application/json');
echo $jsonData;
?>
