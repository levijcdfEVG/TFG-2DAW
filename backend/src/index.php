<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/controllers/UsuarioController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Obtener el endpoint y el ID si existe
$endpoint = $uri[count($uri) - 2] ?? '';
$id = $uri[count($uri) - 1] ?? null;

// Crear instancia del controlador
$controller = new UsuarioController();

// Manejar las rutas
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($id && is_numeric($id)) {
            $controller->getUserById($id);
        } else {
            $controller->getUsersByFilter();
        }
        break;
    
    case 'POST':
        $controller->createUser();
        break;
    
    case 'PUT':
        if ($id && is_numeric($id)) {
            $controller->updateUser($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID no válido']);
        }
        break;
    
    case 'DELETE':
        if ($id && is_numeric($id)) {
            $controller->deleteUser($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID no válido']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>

