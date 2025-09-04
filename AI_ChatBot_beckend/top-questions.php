<?php
require_once("db_connection.php");

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Prepare query to get the top 5 questions
$query = "SELECT Questions_List FROM q_and_a_lists ORDER BY Searched_Count DESC LIMIT 5";
$result = $conn->query($query);

// Check for query errors
if (!$result) {
    die("Query failed: " . $conn->error);
}

// Fetch results and prepare the array
$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = $row['Questions_List'];
}

// Return the result as a JSON response
echo json_encode($questions);
?>
