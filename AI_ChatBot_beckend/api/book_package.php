<?php
include '../db_connection.php';
session_start();

if(!isset($_SESSION['user_id'])) {
  echo json_encode(['error' => 'User not logged in']);
  exit;
}

$user_id = $_SESSION['user_id'];
$package_id = $_POST['package_id'];
$travel_date = $_POST['travel_date'];
$num_people = $_POST['num_people'];
$total_price = $_POST['total_price'];

$sql = "INSERT INTO bookings (user_id, package_id, travel_date, num_people, total_price, status) VALUES (?, ?, ?, ?, ?, 'pending')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iisid", $user_id, $package_id, $travel_date, $num_people, $total_price);
$stmt->execute();

echo json_encode(['success' => true]);
?>
