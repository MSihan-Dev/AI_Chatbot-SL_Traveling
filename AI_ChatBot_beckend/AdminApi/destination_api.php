<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');
error_reporting(0); // temporarily turn off warnings
ini_set('display_errors', 0);
include("../db_connection.php");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // 🔍 View All Destinations
        $result = mysqli_query($conn, "SELECT * FROM destinations");
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        // ➕ Insert New Destination
        $input = json_decode(file_get_contents("php://input"), true);
        $name = $input['name'];
        $description = $input['description'];
        $location = $input['location'];
        $category = $input['category'];
        $image_url = $input['image_url'];

        $stmt = $conn->prepare("INSERT INTO destinations (name, description, location, category, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $description, $location, $category, $image_url);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Destination added."]);
        } else {
            echo json_encode(["success" => false, "message" => "Insertion failed."]);
        }
        break;

    case 'PUT':
        // ✏️ Update Destination
        $input = json_decode(file_get_contents("php://input"), true);
        $destination_id = $input['destination_id'];
        $name = $input['name'];
        $description = $input['description'];
        $location = $input['location'];
        $category = $input['category'];
        $image_url = $input['image_url'];

        $stmt = $conn->prepare("UPDATE destinations SET name = ?, description = ?, location = ?, category = ?, image_url = ? WHERE destination_id = ?");
        $stmt->bind_param("sssssi", $name, $description, $location, $category, $image_url, $destination_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Destination updated."]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed."]);
        }
        break;

    case 'DELETE':
        // ❌ Delete Destination
        $input = json_decode(file_get_contents("php://input"), true);
        $destination_id = $input['destination_id'];

        $stmt = $conn->prepare("DELETE FROM destinations WHERE destination_id = ?");
        $stmt->bind_param("i", $destination_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Destination deleted."]);
        } else {
            echo json_encode(["success" => false, "message" => "Deletion failed."]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        break;
}
?>
