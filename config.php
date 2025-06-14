<?php
$serveur = "localhost";
$username = "root";
$password = "";
$db = "gimmobilier";
$conn = mysqli_connect($serveur, $username, $password, $db);
if($conn->connect_error){
    die("Erreur");
}


?>