<?php

header('Content-Type: application/json');

$newScore = json_decode(file_get_contents('php://input'), true);

if ($newScore && isset($newScore['playerName']) && isset($newScore['score'])) {
    // Append the new score to the leaderboard.md file
    file_put_contents('leaderboard.md', PHP_EOL . '- ' . $newScore['playerName'] . ': ' . $newScore['score'], FILE_APPEND);

    // Respond with a success message
    echo json_encode(['success' => true]);
} else {
    // Respond with an error message if data is invalid
    echo json_encode(['error' => 'Invalid data']);
}

?>
