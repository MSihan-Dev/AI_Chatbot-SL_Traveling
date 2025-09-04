<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include("../db_connection.php");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // View all Q&A
    $sql = "SELECT * FROM q_and_a_lists";
    $result = $conn->query($sql);
    $qna = [];

    while ($row = $result->fetch_assoc()) {
        $qna[] = $row;
    }

    echo json_encode($qna);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

switch ($action) {
    case 'insert':
        $question = $data['Questions_List'];
        $answer = $data['Answers_List'];
        $admin_id = $data['Admin_Id'];

        $sql = "INSERT INTO q_and_a_lists (Questions_List, Answers_List, Admin_Id) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $question, $answer, $admin_id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Q&A added successfully"]);
        } else {
            echo json_encode(["error" => "Insert failed"]);
        }
        break;

    case 'update':
        $id = $data['Q_A_Id'];
        $question = $data['Questions_List'];
        $answer = $data['Answers_List'];

        $sql = "UPDATE q_and_a_lists SET Questions_List=?, Answers_List=? WHERE Q_A_Id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $question, $answer, $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Q&A updated successfully"]);
        } else {
            echo json_encode(["error" => "Update failed"]);
        }
        break;

    case 'delete':
        $id = $data['Q_A_Id'];

        $sql = "DELETE FROM q_and_a_lists WHERE Q_A_Id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Q&A deleted successfully"]);
        } else {
            echo json_encode(["error" => "Delete failed"]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}
?>
