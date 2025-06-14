<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['logementId'])) {
        $logementId = mysqli_real_escape_string($conn, $data['logementId']);

        $sql = "DELETE FROM logement WHERE NumLog = $logementId";

        if (mysqli_query($conn, $sql)) {
            $response = ['success' => true, 'message' => 'Le logement a été supprimée avec succès.'];
        } else {
            $response = ['success' => false, 'message' => 'Erreur lors de la suppression du logement : ' . mysqli_error($conn)];
        }
    } else {
        $response = ['success' => false, 'message' => 'ID du logement non spécifié.'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
