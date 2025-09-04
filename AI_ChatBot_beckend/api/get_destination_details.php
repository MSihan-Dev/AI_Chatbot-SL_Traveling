<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../db_connection.php';

$id = $_GET['id'];

$destination_sql = "SELECT * FROM destinations WHERE destination_id = ?";
$destination_stmt = $conn->prepare($destination_sql);
$destination_stmt->bind_param("i", $id);
$destination_stmt->execute();
$destination_result = $destination_stmt->get_result();
$destination = $destination_result->fetch_assoc();

$packages_sql = "SELECT * FROM packages WHERE destination_id = ?";
$packages_stmt = $conn->prepare($packages_sql);
$packages_stmt->bind_param("i", $id);
$packages_stmt->execute();
$packages_result = $packages_stmt->get_result();

$packages = [];
while($row = $packages_result->fetch_assoc()) {
  $packages[] = $row;
}

echo json_encode(['destination' => $destination, 'packages' => $packages]);
?>
