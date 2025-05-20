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
            // Esto ya devuelve un array con success, message y data
            $response = $this->mFormacion->listarAllFormaciones();

            echo json_encode($response);
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }


    public function crearFormacion() {
        // if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        //     $this->methodNotAllowed(['POST']);
        //     return;
        // }
        
        try {
            // Obtener los datos JSON enviados desde el frontend
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            if (!$data) {
                $this->sendResponse(false, 'Datos JSON no válidos o mal formateados', null, 400);
                return;
            }

            // Llamar al modelo
            $resultado = $this->mFormacion->insertarFormacion($data);

            // Respuesta según resultado
            if ($resultado['success']) {
                $this->sendResponse(true, 'Formación creada correctamente', $resultado, 201);
            } else {
                $this->sendResponse(false, 'Error al crear formación', $resultado, 400);
            }

        } catch (Exception $e) {
            $this->sendResponse(false, 'Error inesperado: ' . $e->getMessage(), null, 500);
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
                $this->sendResponse(false, 'Falta el ID de la formación', null, 400);
                return;
            }

            $idFormacion = (int)$input['id'];

            // Validar y sanitizar aquí si quieres antes

            $response = $this->mFormacion->updateFormacion($idFormacion, $input);

            if ($response['success']) {
                $this->sendResponse(true, $response['message']);
            } else {
               $this->sendResponse(false, $response['message'], null, 500);
            }

        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
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
                $this->sendResponse(false, 'Falta el ID de la formación', null, 400);
                return;
            }
            $idFormacion = (int)$input['id'];

            $response = $this->mFormacion->desactivarFormacionPorId($idFormacion);

            if ($response['success']) {
                $this->sendResponse(true, $response['message']);
            } else {
                $this->sendResponse(false, $response['message'], null, 404);
            }

        } catch (Exception $e) {
           $this->sendResponse(false, $e->getMessage(), null, 500);
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
                $this->sendResponse(false, 'Falta el ID de la formación', null, 400);
                return;
            }
            $idFormacion = (int)$input['id'];

            $response = $this->mFormacion->borrarFormacionPorId($idFormacion);

            if ($response['success']) {
                $this->sendResponse(true, $response['message']);
            } else {
              $this->sendResponse(false, $response['message'], null, 404);
            }

        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }

    private function sendResponse($success, $message = '', $data = null, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);

        $response = [
            'success' => $success,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        echo json_encode($response);
    }


     private function methodNotAllowed(array $allowed) {
        header('Allow: ' . implode(', ', $allowed));
        http_response_code(405);
        echo json_encode(['error' => 'Metodo no permitido. Usa: ' . implode(', ', $allowed)]);
        exit;
    }
    

}