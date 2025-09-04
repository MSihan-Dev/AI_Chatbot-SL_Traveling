<?php
include '../db_connection.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$sql = "SELECT * FROM new_q_and_a_list";
$result = $conn->query($sql);

$qna = [];
while ($row = $result->fetch_assoc()) {
    $qna[] = $row;
}

echo json_encode($qna);
?>
