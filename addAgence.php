<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST['agenceLib'], $_POST['provinceLib'])) {
        $agenceLib = $_POST['agenceLib'];
        $provinceLib = $_POST['provinceLib'];

        $sqlProvince = "SELECT CodePro FROM province WHERE LibPro = '$provinceLib'";
        $resultProvince = mysqli_query($conn, $sqlProvince);
        $rowProvince = mysqli_fetch_assoc($resultProvince);
        $provinceCode = $rowProvince['CodePro'];

        $sqlInsert = "INSERT INTO agence (LibAg, CodePro) VALUES ('$agenceLib', '$provinceCode')";

        if (mysqli_query($conn, $sqlInsert)) {
            $response = ['success' => true, 'message' => 'L\'agence a été ajoutée avec succès.'];
        } else {
            $response = ['success' => false, 'message' => 'Erreur lors de l\'ajout de l\'agence : ' . mysqli_error($conn)];
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
