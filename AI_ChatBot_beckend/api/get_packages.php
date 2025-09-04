<?php
include '../db_connection.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_GET['destination_id'])) {
    $id = $_GET['destination_id'];

    $stmt = $conn->prepare("SELECT * FROM packages WHERE destination_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $packages = [];
    while ($row = $result->fetch_assoc()) {
        $packages[] = $row;
    }

    echo json_encode($packages);
} else {
    echo json_encode(["error" => "destination_id not provided"]);
}
?>
