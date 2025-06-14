<?php
require('fpdf/fpdf.php');

function genererFacture($numCli, $numLog, $montant, $datePay, $modePay) {
    // Connexion à la base de données
    require_once 'config.php';

    // Récupérer les informations du client et du logement
    $sql = "SELECT c.NomCli, c.PrenomCli, c.AdresseCli, l.NomLog, l.PrixLog 
            FROM client c 
            JOIN logement l ON l.NumLog = $numLog 
            WHERE c.NumCli = $numCli";
    $result = mysqli_query($conn, $sql);
    $client = mysqli_fetch_assoc($result);

    // Créer un PDF
    $pdf = new FPDF();
    $pdf->AddPage();

    // En-tête
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Facture de Paiement', 0, 1, 'C');

    // Informations du client
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(100, 10, 'Nom: ' . $client['NomCli'] . ' ' . $client['PrenomCli']);
    $pdf->Ln();
    $pdf->Cell(100, 10, 'Adresse: ' . $client['AdresseCli']);
    $pdf->Ln();
    $pdf->Cell(100, 10, 'Logement: ' . $client['NomLog']);
    $pdf->Ln();

    // Détails du paiement
    $pdf->Cell(100, 10, 'Montant Paye: ' . $montant . ' Ar');
    $pdf->Ln();
    $pdf->Cell(100, 10, 'Date de Paiement: ' . $datePay);
    $pdf->Ln();
    $pdf->Cell(100, 10, 'Type de payement: ' . $modePay);
    $pdf->Ln();

    // Sauvegarder le PDF
    $filename = 'factures/facture_' . $numCli . '_' . $numLog . '_' . time() . '.pdf';
    $pdf->Output('F', $filename);

    return $filename;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $numCli = $data['NumCli'];
    $numLog = $data['NumLog'];
    $montant = $data['MontantPay'];
    $modePay = $data['ModePay'];
    $datePay = $data['DatePay'];

    // Générer la facture
    $facturePath = genererFacture($numCli, $numLog, $montant, $datePay, $modePay);

    // Répondre avec le chemin du fichier PDF
    echo json_encode(['success' => true, 'facture' => $facturePath]);
}
?>
