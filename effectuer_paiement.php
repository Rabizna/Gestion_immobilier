<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$numCli = $data['NumCli'];
$numLog = $data['NumLog'];
$montant = $data['MontantPay'];
$modePay = $data['ModePay'];
$datePay = $data['DatePay'];

$sql = "INSERT INTO paiements (NumCli, NumLog, MontantPay, ModePay, DatePay) VALUES ($numCli, $numLog, $montant, '$modePay', '$datePay')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors du paiement']);
}

mysqli_close($conn);
?>
