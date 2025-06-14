<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['searchTerm'])) {
    $searchTerm = $_GET['searchTerm'];
    $searchTerm = mysqli_real_escape_string($conn, $searchTerm);

    $sql = "SELECT agence.CodeAg, agence.LibAg, province.LibPro 
            FROM agence 
            INNER JOIN province ON agence.CodePro = province.CodePro 
            WHERE agence.LibAg LIKE '%$searchTerm%' OR province.LibPro LIKE '%$searchTerm%'";
    
    $result = mysqli_query($conn, $sql);
    
    $agences = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $agences[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode(['agences' => $agences]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
