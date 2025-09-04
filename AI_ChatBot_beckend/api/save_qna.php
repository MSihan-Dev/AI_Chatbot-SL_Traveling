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

if (
    isset($data['New_Q_A_Id']) &&
    isset($data['New_Questions_List']) &&
    isset($data['New_Answers_List']) &&
    isset($data['Admin_Id'])
) {
    $newId = $data['New_Q_A_Id'];
    $question = $conn->real_escape_string($data['New_Questions_List']);
    $answer = $conn->real_escape_string($data['New_Answers_List']);
    $adminId = intval($data['Admin_Id']);

    // Insert into q_and_a_lists
    $insertSql = "INSERT INTO q_and_a_lists (Questions_List, Answers_List, Searched_Count, Admin_Id)
                  VALUES ('$question', '$answer', 0, $adminId)";
    
    if ($conn->query($insertSql)) {
        // Delete from new_q_and_a_list
        $deleteSql = "DELETE FROM new_q_and_a_list WHERE New_Q_A_Id = $newId";
        $conn->query($deleteSql);
        
        echo json_encode(["success" => true, "message" => "Saved successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Insert failed: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
}
