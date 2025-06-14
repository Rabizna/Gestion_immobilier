<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nomLog = mysqli_real_escape_string($conn, $_POST['NomLog']);
    $prixLog = mysqli_real_escape_string($conn, $_POST['PrixLog']);
    $codeCite = mysqli_real_escape_string($conn, $_POST['codeCite']);
    $terrain = mysqli_real_escape_string($conn, $_POST['terrain']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $imageLog = '';

    // Gestion du fichier image
    if (isset($_FILES['ImageLog']) && $_FILES['ImageLog']['error'] == 0) {
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["ImageLog"]["name"]);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Vérification du type de fichier
        $check = getimagesize($_FILES["ImageLog"]["tmp_name"]);
        if ($check !== false) {
            if (move_uploaded_file($_FILES["ImageLog"]["tmp_name"], $targetFile)) {
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

    $sql = "INSERT INTO logement (NomLog, PrixLog, ImageLog, codeCite, terrain, description) VALUES ('$nomLog', '$prixLog', '$imageLog', '$codeCite', '$terrain', '$description')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['success' => true, 'message' => 'Le logement a été ajouté avec succès.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout du logement : ' . mysqli_error($conn)]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
