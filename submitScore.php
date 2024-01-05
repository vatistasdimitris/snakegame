<?php
header("Content-Type: application/json");

// Retrieve JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['playerName']) && is_string($data['playerName']) && !empty($data['score']) && is_numeric($data['score'])) {
  $playerName = htmlspecialchars($data['playerName']);
  $score = intval($data['score']);

  // Prepare the entry for leaderboard
  $entry = "| " . $playerName . " | " . $score . " |\n";

  // Append the entry to the leaderboard.md file
  $result = file_put_contents('leaderboard.md', $entry, FILE_APPEND | LOCK_EX);

  if ($result !== false) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['error' => 'Failed to append entry to leaderboard.']);
  }
} else {
  echo json_encode(['error' => 'Invalid data format.']);
}
?>
