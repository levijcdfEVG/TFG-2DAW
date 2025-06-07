<?php
require_once __DIR__ . '/GoogleJWTVerifier.php';
require_once __DIR__ . '/../models/mUsuario.php';



/**
 * Verifica el token enviado por el frontend y el correo contra la whitelist.
 *
 * @return string El correo si todo es válido.
 */
function verificarTokenYCorreo(): string {
    $modeloUsuario = new mUsuario();

    $id_token = getAuthorizationHeader();

    if (empty($id_token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Token no proporcionado o vacio']);
        exit;
    }

    // Quitar el prefijo "Bearer " si está presente
    $id_token = preg_replace('/^Bearer\s+/i', '', $id_token);

    try {
        $payload = GoogleJWTVerifier::verify($id_token);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Token invalido o no verificable']);
        exit;
    }

    $email = $payload['email'] ?? '';
    $resultado = $modeloUsuario->getUsuarioPorCorreo($email);

    if (!$resultado) {
        http_response_code(403);
        echo json_encode(['error' => 'Correo no autorizado']);
        exit;
    }

    if ($resultado['id_rol'] !== 2 && $resultado['id_rol'] !== 3) {
        http_response_code(403);
        echo json_encode(['error' => 'No tiene permisos suficientes']);
        exit;
    }


    return $email;
}

function getAuthorizationHeader() {
    $headers = null;

    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { 
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}
