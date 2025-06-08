<?php
// filepath: c:\Users\David\Desktop\TFG OFICIAL\TFG-2DAW\backend\src\index.php

/**
 * Archivo principal del backend.
 *
 * Este archivo actúa como punto de entrada para las solicitudes al backend.
 * Configura los encabezados HTTP, carga los controladores y ejecuta las acciones solicitadas.
 *
 * @category Backend
 * @package  TFG-2DAW
 * @author   David Silva Vega <dsilvavega.guadalupe@alumnado.fundacionloyola.net>
 * @license  https://opensource.org/licenses/MIT MIT License
 * 
 */

// Configuración de los encabezados HTTP para permitir CORS.
/**
 * Configura los encabezados HTTP para permitir solicitudes CORS.
 */
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Responder correctamente a la petición OPTIONS y salir
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Carga de configuraciones y dependencias.
require_once 'config/config.php';
require_once MODELS . 'conexion.php';

// Carga dinámica del controlador solicitado.
/**
 * Ruta del controlador solicitado.
 *
 * @var string $rutaControlador Ruta del archivo del controlador.
 */
$rutaControlador = CONTROLLERS . $_GET["controlador"] . '.php';
require_once $rutaControlador;

/**
 * Nombre del controlador solicitado.
 *
 * @var string $nombreControlador Nombre de la clase del controlador.
 */
$nombreControlador = $_GET["controlador"];

/**
 * Instancia del controlador solicitado.
 *
 * @var object $controlador Instancia del controlador.
 */
$controlador = new $nombreControlador();

// Verifica si el método solicitado existe en el controlador.
/**
 * Ejecuta la acción solicitada en el controlador.
 *
 * @param string $accion     Nombre de la acción solicitada.
 * @param array  $parametros Parámetros adicionales enviados en la solicitud.
 *
 * @return void
 */
if (method_exists($controlador, $_GET["accion"])) {
    $accion = $_GET["accion"];
    $parametros = array_diff_key($_GET, array_flip(['controlador', 'accion']));

    // Ejecuta y permite que el controlador maneje la respuesta.
    $controlador->$accion($parametros);
}

exit;