<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numLog = mysqli_real_escape_string($conn, $_POST['logId']);
    $nomLog = mysqli_real_escape_string($conn, $_POST['logName']);
    $prixLog = mysqli_real_escape_string($conn, $_POST['logPrice']);
    $codeCite = mysqli_real_escape_string($conn, $_POST['logCite']);
    $terrain = mysqli_real_escape_string($conn, $_POST['logTerrain']);
    $description = mysqli_real_escape_string($conn, $_POST['logDesc']);
    $imageLog = '';

    // Gestion du fichier image
    if (isset($_FILES['logImage']) && $_FILES['logImage']['error'] == 0) {
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["logImage"]["name"]);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Vérification du type de fichier
        $check = getimagesize($_FILES["logImage"]["tmp_name"]);
        if ($check !== false) {
            if (move_uploaded_file($_FILES["logImage"]["tmp_name"], $targetFile)) {
                $imageLog = $targetFile;
            } else {
                echo json_encode(['success' => false, 'message' => 'Erreur lors du téléchargement de l\'image.']);
                exit;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Le fichier n\'est pas une image.']);
            exit;
        }
    }

    // Préparation de la requête SQL
    if ($imageLog) {
        $sql = "UPDATE logement SET 
                    NomLog = '$nomLog', 
                    PrixLog = '$prixLog', 
                    ImageLog = '$imageLog', 
                    codeCite = '$codeCite', 
                    terrain = '$terrain', 
                    description = '$description' 
                WHERE NumLog = '$numLog'";
    } else {
        $sql = "UPDATE logement SET 
                    NomLog = '$nomLog', 
                    PrixLog = '$prixLog', 
                    codeCite = '$codeCite', 
                    terrain = '$terrain', 
                    description = '$description' 
                WHERE NumLog = '$numLog'";
    }

    // Exécution de la requête SQL
    if (mysqli_query($conn, $sql)) {
        echo json_encode(['success' => true, 'message' => 'Le logement a été mis à jour avec succès.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour du logement : ' . mysqli_error($conn)]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
