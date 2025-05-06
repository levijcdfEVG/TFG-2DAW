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

        public function modificarCentro() {
            // Leer los datos enviados desde el frontend
            $inputData = json_decode(file_get_contents('php://input'), true);
        
            // Validar que las claves necesarias existen
            if (
                isset($inputData['emailReferencia']) &&
                isset($inputData['datosModificados']) &&
                is_array($inputData['datosModificados'])
            ) {
                $emailReferencia = $inputData['emailReferencia'];
                $datosModificados = $inputData['datosModificados'];
        
                // Extraer los datos modificados
                $nombreCentro = $datosModificados['nombre_centro'] ?? null;
                $direccionCentro = $datosModificados['direccion_centro'] ?? null;
                $cpCentro = $datosModificados['cp'] ?? null;
                $localidadCentro = $datosModificados['nombre_localidad'] ?? null;
                $telefonoCentro = $datosModificados['telefono_centro'] ?? null;
                $emailCentro = $datosModificados['correo_centro'] ?? null;
        
                // Llamar al modelo para realizar la modificación
                $resultado = $this->objCentro->modificarCentro(
                    $emailReferencia,
                    $nombreCentro,
                    $direccionCentro,
                    $cpCentro,
                    $localidadCentro,
                    $telefonoCentro,
                    $emailCentro
                );
        
                // Responder con el resultado
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