<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userMessage = strtolower(trim($data['message'] ?? ''));

if (!$userMessage) {
    echo json_encode(["reply" => "Please enter a valid message."]);
    exit;
}

// Database connection
$conn = new mysqli("localhost", "root", "", "ai_chatbot_db");
if ($conn->connect_error) {
    echo json_encode(["reply" => "Database connection failed."]);
    exit;
}

// Step 1: Define stopwords
$stopwords = ["i", "me", "my", "we", "you", "he", "she", "it", 
"they", "is", "am", "are", "was", "were", "do", "does", "did", "in", "on", 
"at", "for", "with", "the", "a", "an", "to", "of", "and", "or", "where", 
"what", "should", "go", "can", "could"];

// Step 2: Clean and extract keywords
$words = explode(' ', preg_replace('/[^a-zA-Z0-9 ]/', '', $userMessage));
$keywords = array_filter($words, function ($word) use ($stopwords) {
    return !in_array($word, $stopwords);
});

// Step 3: Search with keyword matching
$reply = '';
if (count($keywords) > 0) {
    $query = "SELECT Q_A_Id, Questions_List, Answers_List, Searched_Count FROM q_and_a_lists";
    $result = $conn->query($query);

    $bestMatch = null;
    $highestMatchCount = 0;
    $bestMatchId = null;

    while ($row = $result->fetch_assoc()) {
        $question = strtolower($row['Questions_List']);
        $matchCount = 0;

        foreach ($keywords as $kw) {
            if (strpos($question, $kw) !== false) {
                $matchCount++;
            }
        }

        if ($matchCount > $highestMatchCount) {
            $highestMatchCount = $matchCount;
            $bestMatch = $row['Answers_List'];
            $bestMatchId = $row['Q_A_Id'];
        }
    }

    // If a best match was found, return the answer and update search count
    if ($bestMatch && $highestMatchCount > 0 && $bestMatchId !== null) {
        $reply = $bestMatch;

        // ✅ Update Searched_Count by +1
        $updateStmt = $conn->prepare("UPDATE q_and_a_lists SET `Searched_Count` = COALESCE(`Searched_Count`, 0) + 1 WHERE Q_A_Id = ?");
        $updateStmt->bind_param("i", $bestMatchId);
        $updateStmt->execute();
    }
}

// Step 4: Fallback to DeepSeek
if (!$reply) {
    $reply = getAnswerFromDeepSeek($userMessage);

    // Check for API error or failure message
    if (str_starts_with($reply, "Error:") || $reply === "Sorry, I couldn't get a proper response.") {
        $replyToSave = "waiting...";
    } else {
        $replyToSave = $reply;
    }

    // Log it for admin review
    $insertStmt = $conn->prepare("INSERT INTO new_q_and_a_list (New_Questions_List, New_Answers_List) VALUES (?, ?)");
    $insertStmt->bind_param("ss", $userMessage, $replyToSave);
    $insertStmt->execute();
}

echo json_encode(["reply" => $reply]);
$conn->close();


// DeepSeek integration
function getAnswerFromDeepSeek($prompt) {
    $apiKey = "sk-a9f25fa9bb3240de9848bfe346b83d3e";
    $url = "https://api.deepseek.com/v1/chat/completions";

    $headers = [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ];

    $postData = json_encode([
        "model" => "deepseek-chat",
        "messages" => [
            ["role" => "user", "content" => $prompt]
        ]
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        $error_message = curl_error($ch);
        curl_close($ch);
        return "Error: $error_message";
    }
    curl_close($ch);

    $responseData = json_decode($response, true);

    if (isset($responseData['choices'][0]['message']['content'])) {
        return trim($responseData['choices'][0]['message']['content']);
    } else {
        return "Sorry, I couldn't get a proper response.";
    }
}
?>
