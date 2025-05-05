<?php
    require_once MODELS.'mCentros.php';

    class cCentros {

        public function __construct() {

            $this->objCentro = new mCentros();
        }

        public function listaCentros(){
            $resultado = $this->objCentro->listaCentros();

            // Devolver los datos en formato JSON
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function insertIntoCentros(){
            // Depurar los datos recibidos
            error_log('Contenido de $_POST: ' . print_r($_POST, true)); // Para datos enviados como application/x-www-form-urlencoded
            error_log('Contenido de php://input: ' . file_get_contents('php://input')); // Para datos enviados como JSON

        
            // Validar que las claves existen en $_POST
            if (
                isset($_POST['nombre_centro'], $_POST['direccion_centro'], $_POST['cp'], 
                      $_POST['nombre_localidad'], $_POST['telefono_centro'], $_POST['correo_centro'])
            ) {
                $nombreCentro = $_POST['nombre_centro'];
                $direccionCentro = $_POST['direccion_centro'];
                $cpCentro = $_POST['cp'];
                $localidadCentro = $_POST['nombre_localidad'];
                $telefonoCentro = $_POST['telefono_centro'];
                $emailCentro = $_POST['correo_centro'];
        
                $resultado = $this->objCentro->insertIntoCentros($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro);
        
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                // Respuesta de error si faltan datos
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
            }
        }
    }

?>