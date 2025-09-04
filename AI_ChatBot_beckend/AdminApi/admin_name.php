<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Admin not logged in']);
    exit;
}

include 'db_connection.php';

$adminId = $_SESSION['admin_id'];
$sql = "SELECT Name FROM admin_details WHERE Admin_Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $adminId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'name' => $row['Name']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found']);
}
?>
