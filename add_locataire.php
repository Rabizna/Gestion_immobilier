<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$nom = $data['nom'];
$prenom = $data['prenom'];
$adresse = $data['adresse'];
$logement = $data['logement'];

// Obtenir le NumCli maximum actuel
$sqlMax = "SELECT IFNULL(MAX(NumCli), 0) + 1 AS newNumCli FROM client";
$resultMax = mysqli_query($conn, $sqlMax);
$rowMax = mysqli_fetch_assoc($resultMax);
$newNumCli = $rowMax['newNumCli'];

// Insérer le nouveau client avec le NumCli généré
$sqlClient = "INSERT INTO client (NumCli, NomCli, PrenomCli, AdresseCli) VALUES (?, ?, ?, ?)";
$stmtClient = $conn->prepare($sqlClient);
$stmtClient->bind_param("isss", $newNumCli, $nom, $prenom, $adresse);

if ($stmtClient->execute()) {
    $sqlAchat = "INSERT INTO achat (TypeAchat, DateAchat, NumCli, NumLog) VALUES (1, CURDATE(), ?, ?)";
    $stmtAchat = $conn->prepare($sqlAchat);
    $stmtAchat->bind_param("ii", $newNumCli, $logement);

    if ($stmtAchat->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement de l\'achat.', 'error' => $stmtAchat->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du client.', 'error' => $stmtClient->error]);
}

$stmtClient->close();
$stmtAchat->close();
$conn->close();
?>
