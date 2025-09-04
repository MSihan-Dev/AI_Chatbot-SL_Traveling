<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../db_connection.php';

$sql = "SELECT destination_id, name FROM destinations LIMIT 10";
$result = $conn->query($sql);

$destinations = [];
while($row = $result->fetch_assoc()) {
  $destinations[] = $row;
}

echo json_encode($destinations);
?>
