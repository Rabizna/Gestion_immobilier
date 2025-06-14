<?php
require_once 'config.php';

$sql = "SELECT codeCite, LibCite FROM cite";
$result = mysqli_query($conn, $sql);

$cites = array();

while ($row = mysqli_fetch_assoc($result)) {
    $cites[] = $row;
}

header('Content-Type: application/json');
echo json_encode(['cites' => $cites]);
?>
