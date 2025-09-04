<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include("../db_connection.php");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $sql = "SELECT p.*, d.name AS destination_name 
          FROM packages p 
          JOIN destinations d ON p.destination_id = d.destination_id";
  $result = $conn->query($sql);

  $packages = [];
  while ($row = $result->fetch_assoc()) {
    $packages[] = $row;
  }

  echo json_encode($packages);
  exit;
}

if ($method === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $stmt = $conn->prepare("INSERT INTO packages (destination_id, title, price, duration_days, inclusions, created_by) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("isdssi", $data['destination_id'], $data['title'], $data['price'], $data['duration_days'], $data['inclusions'], $data['created_by']);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Package added successfully"]);
  } else {
    echo json_encode(["error" => "Failed to add package"]);
  }
  exit;
}

if ($method === "PUT") {
  $data = json_decode(file_get_contents("php://input"), true);
  $stmt = $conn->prepare("UPDATE packages SET destination_id=?, title=?, price=?, duration_days=?, inclusions=? WHERE package_id=?");
  $stmt->bind_param("isdssi", $data['destination_id'], $data['title'], $data['price'], $data['duration_days'], $data['inclusions'], $data['package_id']);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Package updated successfully"]);
  } else {
    echo json_encode(["error" => "Failed to update package"]);
  }
  exit;
}

if ($method === "DELETE") {
  parse_str(file_get_contents("php://input"), $data);
  $packageId = $data['package_id'];

  $stmt = $conn->prepare("DELETE FROM packages WHERE package_id=?");
  $stmt->bind_param("i", $packageId);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Package deleted successfully"]);
  } else {
    echo json_encode(["error" => "Failed to delete package"]);
  }
  exit;
}
?>
