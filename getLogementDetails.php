<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['NumLog'])) {
    $NumLog = $_GET['NumLog'];

    $sql = "SELECT 
                logement.NumLog, 
                logement.NomLog, 
                logement.PrixLog, 
                cite.LibCite, 
                logement.terrain AS Superficie,
                logement.ImageLog,
                logement.description,
                CASE 
                    WHEN achat.NumLog IS NULL THEN 'Disponible' 
                    ELSE CONCAT('Occupé par ', client.NomCli) 
                END AS Disponibilite
            FROM 
                logement 
            INNER JOIN 
                cite ON logement.codeCite = cite.codeCite
            LEFT JOIN 
                achat ON logement.NumLog = achat.NumLog
            LEFT JOIN 
                client ON achat.NumCli = client.NumCli
            WHERE 
                logement.NumLog = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $NumLog);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $logement = $result->fetch_assoc();
        echo json_encode(['success' => true, 'logement' => $logement]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Logement non trouvé.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Requête invalide.']);
}
?>
