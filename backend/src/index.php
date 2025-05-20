<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

    require_once 'config/config.php'; 
    require_once MODELS.'conexion.php';


$rutaControlador = CONTROLLERS.$_GET["controlador"].'.php';
require_once $rutaControlador;

$nombreControlador = $_GET["controlador"];
$controlador = new $nombreControlador();

if (method_exists($controlador, $_GET["accion"])) {
    $accion = $_GET["accion"];
    $parametros = array_diff_key($_GET, array_flip(['controlador', 'accion']));

    // Ejecuta y permite que el controlador maneje la respuesta
    $controlador->$accion($parametros);
}
// Responder correctamente a la petición OPTIONS y salir
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
}
exit;
