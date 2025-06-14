<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['agenceId'], $data['agenceLib'], $data['provinceLib'])) {
        $agenceId = mysqli_real_escape_string($conn, $data['agenceId']);
        $agenceLib = mysqli_real_escape_string($conn, $data['agenceLib']);
        $codePro = mysqli_real_escape_string($conn, $data['provinceLib']);

        $sql = "UPDATE agence SET LibAg = '$agenceLib', CodePro = $codePro WHERE CodeAg = $agenceId";

        if (mysqli_query($conn, $sql)) {
            $response = ['success' => true, 'message' => 'Les détails de l\'agence ont été mis à jour avec succès.'];
        } else {
            $response = ['success' => false, 'message' => 'Erreur lors de la mise à jour des détails de l\'agence : ' . mysqli_error($conn)];
        }
    } else {
        $response = ['success' => false, 'message' => 'Toutes les données nécessaires n\'ont pas été fournies.'];
    }


    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
