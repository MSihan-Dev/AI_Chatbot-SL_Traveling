<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
include '../db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['New_Q_A_Id'])) {
    $id = intval($data['New_Q_A_Id']);
    $deleteSql = "DELETE FROM new_q_and_a_list WHERE New_Q_A_Id = $id";

    if ($conn->query($deleteSql)) {
        echo json_encode(["success" => true, "message" => "Deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Delete failed: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID not provided."]);
}
