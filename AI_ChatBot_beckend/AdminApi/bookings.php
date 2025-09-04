<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include("../db_connection.php");


if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $sql = "SELECT 
            b.booking_id, b.booking_date, b.travel_date, b.num_people, b.total_price, b.status,
            u.full_name AS user_name,
            p.title AS package_name
          FROM bookings b
          JOIN users u ON b.user_id = u.user_id
          JOIN packages p ON b.package_id = p.package_id
          ORDER BY b.booking_id DESC";

  $result = $conn->query($sql);
  $bookings = [];

  while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
  }

  echo json_encode($bookings);
}

elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $bookingId = $data["booking_id"] ?? null;
  $status = $data["status"] ?? null;

  if (!$bookingId || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing booking_id or status"]);
    exit();
  }

  $sql = "UPDATE bookings SET status = ? WHERE booking_id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("si", $status, $bookingId);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Status updated successfully"]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update status"]);
  }

  $stmt->close();
}

$conn->close();
?>
