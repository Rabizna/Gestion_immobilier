<?php
// Connexion à la base de données
require_once 'config.php';

// Récupérer les données envoyées depuis le front-end
$data = json_decode(file_get_contents('php://input'), true);
$numCli = $data['NumCli'];

// Supprimer les paiements liés au locataire de la base de données
$sqlDeletePayments = "DELETE FROM paiements WHERE NumCli = $numCli";
if (!mysqli_query($conn, $sqlDeletePayments)) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression des paiements liés']);
    exit(); // Arrêter l'exécution du script en cas d'erreur
}

// Supprimer le locataire de la base de données
$sqlDeleteClient = "DELETE FROM client WHERE NumCli = $numCli";
if (mysqli_query($conn, $sqlDeleteClient)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression du locataire']);
}

// Fermer la connexion à la base de données
mysqli_close($conn);
?>
