<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Path to the downloads JSON file
$jsonFile = '../data/downloads.json';

// Handle POST request to update download count
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (isset($data['count']) && is_numeric($data['count'])) {
        $count = intval($data['count']);
        
        // Prepare the data to save
        $jsonData = [
            'count' => $count,
            'lastUpdated' => date('Y-m-d H:i:s')
        ];
        
        // Save to JSON file
        $result = file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));
        
        if ($result !== false) {
            echo json_encode([
                'success' => true,
                'count' => $count,
                'message' => 'Download count updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save download count'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid count value'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
