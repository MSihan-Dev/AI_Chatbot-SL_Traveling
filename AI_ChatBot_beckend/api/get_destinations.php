<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../db_connection.php';

if (isset($_GET['destination_id'])) {
    $id = intval($_GET['destination_id']);
    $res = $conn->query("SELECT * FROM destinations WHERE destination_id = $id");
    $data = $res->fetch_assoc();
    echo json_encode($data);
} else {
    // Return all destinations
    $res = $conn->query("SELECT * FROM destinations");
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}
?>
