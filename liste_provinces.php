<?php
require_once 'config.php';

$sql = "SELECT * FROM province";
$result = mysqli_query($conn, $sql);

$provinces = array();

while ($row = mysqli_fetch_assoc($result)) {
    $provinces[] = $row;
}

echo json_encode(['provinces' => $provinces]);
?>
