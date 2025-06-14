<?php
require_once 'config.php';

$sql = "SELECT 
            c.NumCli,
            c.NomCli AS Nom, 
            c.PrenomCli AS Prenoms, 
            c.AdresseCli AS Adresse, 
            l.NomLog,
            l.NumLog,
            l.PrixLog,
            CASE 
                WHEN MAX(p.DatePay) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 'A jour'
                ELSE 'En retard'
            END AS EtatPaiement
        FROM client c
        JOIN achat a ON c.NumCli = a.NumCli
        JOIN logement l ON a.NumLog = l.NumLog
        LEFT JOIN paiements p ON c.NumCli = p.NumCli AND l.NumLog = p.NumLog
        GROUP BY c.NumCli, l.NumLog";

$result = mysqli_query($conn, $sql);

$locataires = array();

while ($row = mysqli_fetch_assoc($result)) {
    $locataires[] = $row;
}

$jsonData = json_encode($locataires);

header('Content-Type: application/json');
echo $jsonData;
?>
