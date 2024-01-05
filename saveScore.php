<?php

header('Content-Type: application/json');

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['entry'])) {
    // Append the entry to the leaderboard file
    file_put_contents('leaderboard.md', $data['entry'], FILE_APPEND | LOCK_EX);

    // Respond with a success message
    echo json_encode(['success' => true]);
} else {
    // Respond with an error message
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}
?>
