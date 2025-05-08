<?php
require_once MODELS.'mCentros.php';

class cCentros {

    public function __construct() {
        $this->objCentro = new mCentros();
    }

    public function listaCentros(){
        $resultado = $this->objCentro->listaCentros();
        $this->sendResponse($resultado);
    }

    public function insertIntoCentros(){
        error_log('Contenido de $_POST: ' . print_r($_POST, true));
        error_log('Contenido de php://input: ' . file_get_contents('php://input'));

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
            $this->sendResponse($resultado);
        } else {
            $this->sendResponse(['success' => false, 'message' => 'Faltan datos en la solicitud']);
        }
    }

    public function modificarCentro() {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (
            isset($inputData['emailReferencia']) &&
            isset($inputData['datosModificados']) &&
            is_array($inputData['datosModificados'])
        ) {
            $emailReferencia = $inputData['emailReferencia'];
            $datosModificados = $inputData['datosModificados'];

            $nombreCentro = $datosModificados['nombre_centro'] ?? null;
            $direccionCentro = $datosModificados['direccion_centro'] ?? null;
            $cpCentro = $datosModificados['cp'] ?? null;
            $localidadCentro = $datosModificados['nombre_localidad'] ?? null;
            $telefonoCentro = $datosModificados['telefono_centro'] ?? null;
            $emailCentro = $datosModificados['correo_centro'] ?? null;

            $resultado = $this->objCentro->modificarCentro(
                $emailReferencia,
                $nombreCentro,
                $direccionCentro,
                $cpCentro,
                $localidadCentro,
                $telefonoCentro,
                $emailCentro
            );

            $this->sendResponse($resultado);
        } else {
            $this->sendResponse(['success' => false, 'message' => 'Faltan datos en la solicitud']);
        }
    }

    public function eliminarCentro() {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (isset($inputData['emailReferencia'])) {
            $emailReferencia = $inputData['emailReferencia'];
            $resultado = $this->objCentro->eliminarCentro($emailReferencia);
            $this->sendResponse($resultado);
        } else {
            $this->sendResponse(['success' => false, 'message' => 'Faltan datos en la solicitud']);
        }
    }

    private function sendResponse($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
?>
