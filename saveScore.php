<?php

header('Content-Type: application/json');

$newScore = json_decode(file_get_contents('php://input'), true);

// Append the new score to the JSON file
$leaderboardData = json_decode(file_get_contents('leaderboard.json'), true);
$leaderboardData[] = $newScore;
file_put_contents('leaderboard.json', json_encode($leaderboardData));

echo json_encode(['success' => true]);

?>
