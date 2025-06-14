<?php
// Connexion à la base de données
require_once 'config.php';

// Récupérer les données envoyées depuis le front-end
$data = json_decode(file_get_contents('php://input'), true);
$numCli = $data['NumCli'];
$nomCli = $data['NomCli'];
$prenomCli = $data['PrenomCli'];
$adresseCli = $data['AdresseCli'];

// Modifier le locataire dans la base de données
$sql = "UPDATE client SET NomCli = '$nomCli', PrenomCli = '$prenomCli', AdresseCli = '$adresseCli' WHERE NumCli = $numCli";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la modification du locataire']);
}

// Fermer la connexion à la base de données
mysqli_close($conn);
?>
