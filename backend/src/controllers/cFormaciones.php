<?php 

require_once MODELS.'mFormacion.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php';

Class cFormaciones {


    public function __construct(){
        $this->mFormacion = new MFormacion();
    }

    public function getAllFormaciones() {
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed(['GET']);
            return;
        }
        
        
        try {
            $response = $this->mFormacion->listarAllFormaciones();
            if ($response === false || $response === null) {
                $this->sendResponse(['error' => 'No se pudieron obtener las formaciones'], 500);
            } else {
                $this->sendResponse($response);
            }
        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function crearFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed(['POST']);
            return;
        }
        
        try {
            // Obtener los datos JSON enviados desde el frontend
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            if (!$data) {
                $this->sendResponse(['error' => 'Datos JSON no válidos o mal formateados'], 400);
                return;
            }

            // Llamar al modelo
            $resultado = $this->mFormacion->insertarFormacion($data);

            // Respuesta según resultado
            if ($resultado['success']) {
                $this->sendResponse($resultado, 201); // 201 Created
            } else {
                $this->sendResponse($resultado, 400);
            }

        } catch (Exception $e) {
            $this->sendResponse(['error' => 'Error inesperado: ' . $e->getMessage()], 500);
        }
    }

    public function updateFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed(['PUT']);
            return;
        }
        
        try {
            // Recibimos JSON del body
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['id']) || empty($input['id'])) {
                $this->sendResponse(['error' => 'Falta el ID de la formación'], 400);
                return;
            }

            $idFormacion = (int)$input['id'];

            // Validar y sanitizar aquí si quieres antes

            $response = $this->mFormacion->updateFormacion($idFormacion, $input);

            if ($response['success']) {
                $this->sendResponse(['message' => $response['message']]);
            } else {
                $this->sendResponse(['error' => $response['message']], 500);
            }

        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function desactivarFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed(['PUT']);
            return;
        }
        
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['id']) || empty($input['id'])) {
                $this->sendResponse(['error' => 'Falta el ID de la formación'], 400);
                return;
            }
            $idFormacion = (int)$input['id'];

            $response = $this->mFormacion->desactivarFormacionPorId($idFormacion);

            if ($response['success']) {
                $this->sendResponse(['message' => $response['message']]);
            } else {
                $this->sendResponse(['error' => $response['message']], 404);
            }

        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function borrarFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->methodNotAllowed(['DELETE']);
            return;
        }
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['id']) || empty($input['id'])) {
                $this->sendResponse(['error' => 'Falta el ID de la formación'], 400);
                return;
            }
            $idFormacion = (int)$input['id'];

            $response = $this->mFormacion->borrarFormacionPorId($idFormacion);

            if ($response['success']) {
                $this->sendResponse(['message' => $response['message']]);
            } else {
                $this->sendResponse(['error' => $response['message']], 404);
            }

        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }

    private function sendResponse($response, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($response);
    }

     private function methodNotAllowed(array $allowed) {
        header('Allow: ' . implode(', ', $allowed));
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido. Usa: ' . implode(', ', $allowed)]);
        exit;
    }
    

}