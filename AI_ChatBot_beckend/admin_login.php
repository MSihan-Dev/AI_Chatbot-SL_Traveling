<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Only POST method is allowed"]);
    exit();
}

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit();
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$sql = "SELECT * FROM admin_details WHERE Email = '$email'";
$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    $admin = $result->fetch_assoc();

    // Plain text check (since you said password is manually entered)
    if ($password === $admin['Password']) {
        echo json_encode([
            "success" => true,
            "admin" => [
                "id" => $admin['Admin_Id'],
                "name" => $admin['Name'],
                "email" => $admin['Email']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not found."]);
}
?>
