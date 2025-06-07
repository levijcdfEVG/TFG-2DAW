<?php

if (!isset($_GET['url'])) {
    http_response_code(400);
    echo "Missing 'url' parameter";
    exit;
}

$url = $_GET['url'];

// Solo permitir URLs de Google para seguridad
if (!str_starts_with($url, 'https://lh3.googleusercontent.com/')) {
    http_response_code(403);
    echo "Forbidden image source";
    exit;
}

// Obtener imagen remotamente
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
$imageData = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if (!$imageData) {
    http_response_code(500);
    echo "Failed to fetch image.";
    exit;
}

// Enviar la imagen con cabeceras correctas
header("Content-Type: $contentType");
header("Cache-Control: max-age=86400");
echo $imageData;
