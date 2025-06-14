<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['agenceId'])) {
        $agenceId = mysqli_real_escape_string($conn, $data['agenceId']);

        $sql = "DELETE FROM agence WHERE CodeAg = $agenceId";

        if (mysqli_query($conn, $sql)) {
            $response = ['success' => true, 'message' => 'L\'agence a été supprimée avec succès.'];
        } else {
            $response = ['success' => false, 'message' => 'Erreur lors de la suppression de l\'agence : ' . mysqli_error($conn)];
        }
    } else {
        $response = ['success' => false, 'message' => 'ID de l\'agence non spécifié.'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
