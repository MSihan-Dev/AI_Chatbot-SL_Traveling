<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include("../db_connection.php");

$response = [];

$userResult = $conn->query("SELECT COUNT(*) AS total FROM users");
$response['users'] = $userResult->fetch_assoc()['total'];

$destResult = $conn->query("SELECT COUNT(*) AS total FROM destinations");
$response['destinations'] = $destResult->fetch_assoc()['total'];

$packResult = $conn->query("SELECT COUNT(*) AS total FROM packages");
$response['packages'] = $packResult->fetch_assoc()['total'];

$bookResult = $conn->query("SELECT COUNT(*) AS total FROM bookings");
$response['bookings'] = $bookResult->fetch_assoc()['total'];

echo json_encode($response);
$conn->close();
?>
