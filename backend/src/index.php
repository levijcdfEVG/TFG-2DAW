<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

    require_once 'config/config.php'; //Constantes config php
    require_once MODELS.'conexion.php'; //Clase BBDD

//if(!isset($_GET["controller"])){$_GET["controller"] = DEFAULT_CONTROLLER;}
//if(!isset($_GET["accion"])){$_GET["accion"] = DEFAULT_ACCION;}

$rutaControlador = CONTROLLERS.$_GET["controlador"].'.php'; // 'controller/cControlador.php'

//if(!file_exists($rutaControlador)){$rutaControlador = CONTROLLERS.'c'.DEFAULT_CONTROLADOR.'.php';} // 'controller/cPais.php'

require_once $rutaControlador;

$nombreControlador = $_GET["controlador"]; //nombre de la clase controlador (Ejemplo: cPais)
$controlador = new $nombreControlador(); //Instanciamos objeto de la clase controlador

$dataToView["data"] = array();
if(method_exists($controlador,$_GET["accion"])){
    $dataToView["data"] = $controlador->{$_GET["accion"]}();
}

