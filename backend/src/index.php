<?php
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");


    require_once 'config/config.php'; //Constantes config php
    require_once MODELS.'conexion.php'; //Clase BBDD

    // Establecer valores por defecto si no existen
    if(!isset($_GET["controlador"])){$_GET["controlador"] = DEFAULT_CONTROLLER;}
    if(!isset($_GET["accion"])){$_GET["accion"] = DEFAULT_ACCION;}

    $rutaControlador = CONTROLLERS.$_GET["controlador"].'.php';

    if(!file_exists($rutaControlador)){
        $rutaControlador = CONTROLLERS.DEFAULT_CONTROLLER.'.php';
    }

    require_once $rutaControlador;

    $nombreControlador = $_GET["controlador"];
    $controlador = new $nombreControlador();

    $response = [];
    if(method_exists($controlador, $_GET["accion"])){
        $response = $controlador->{$_GET["accion"]}();
    } else {
        $response = ['success' => false, 'message' => 'Acción no válida o no especificada'];
    }

    exit(json_encode($response)); 

