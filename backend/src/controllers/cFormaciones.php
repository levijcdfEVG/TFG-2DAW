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

            $validatedData = $this->validateForm($data);

            // Llamar al modelo
            $resultado = $this->mFormacion->insertarFormacion($validatedData);

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
        // if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        //     $this->methodNotAllowed(['PUT']);
        //     return;
        // }
        
        try {
            // Recibimos JSON del body
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['id']) || empty($input['id'])) {
                $this->sendResponse(false, 'Falta el ID de la formación', null, 400);
                return;
            }

            $idFormacion = (int)$input['id'];

            //Validaciones
            $validatedData = $this->validateForm($input);


            $response = $this->mFormacion->updateFormacion($idFormacion, $validatedData);

            if ($response['success']) {
                $this->sendResponse(true);
            } else {
               $this->sendResponse(false, $response['message'], null, 500);
            }

        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }

    public function desactivarFormacion() {
        // if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        //     $this->methodNotAllowed(['PUT']);
        //     return;
        // }
        
        
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

    private function validateForm($data) {
        // Validar bloque formacion
        if (!isset($data['formacion']) || !is_array($data['formacion'])) {
            $this->sendResponse(false, 'Falta el bloque "formacion" en los datos', null, 422);
            exit;
        }

        $formacion = $data['formacion'];

        $requiredFields = [
            'lugar_imparticion' => 60,
            'modalidad' => 20,
            'duracion' => 255,
            'justificacion' => 255,
            'metodologia' => 255,
            'docentes' => 255,
            'dirigido_a' => 255,
        ];

        foreach ($requiredFields as $field => $maxLength) {
            if (!isset($formacion[$field]) || trim($formacion[$field]) === '') {
                $this->sendResponse(false, "Falta el campo obligatorio: $field", null, 422);
                exit;
            }

            if (strlen($formacion[$field]) > $maxLength) {
                $this->sendResponse(false, "El campo $field supera los $maxLength caracteres", null, 422);
                exit;
            }
        }

        // Validar duracion si debe ser numérica (lo decides tú)
        if (!is_numeric($formacion['duracion'])) {
            $this->sendResponse(false, "La duración debe ser un número", null, 422);
            exit;
        }

        // Validar cursos
        if (empty($data['cursos']) || !is_array($data['cursos'])) {
            $this->sendResponse(false, "Debes seleccionar al menos un curso académico", null, 422);
            exit;
        }

        // foreach ($data['cursos'] as $curso) {
        //     if (!is_array($curso) || !isset($curso[0]) || !preg_match('/^[0-9]{4}\/[0-9]{2}$/', $curso[0])) {
        //         $this->sendResponse(false, "Formato de curso académico inválido", null, 422);
        //         exit;
        //     }
        // }

        // Validar módulos
        if (!empty($data['modulos']) && is_array($data['modulos'])) {
            foreach ($data['modulos'] as $i => $modulo) {
                if (empty($modulo['nombre_modulo']) || strlen($modulo['nombre_modulo']) > 50) {
                    $this->sendResponse(false, "Módulo #" . ($i + 1) . " inválido o demasiado largo", null, 422);
                    exit;
                }
            }
        }

        // Validar objetivos
        if (!empty($data['objetivos']) && is_array($data['objetivos'])) {
            foreach ($data['objetivos'] as $i => $objetivo) {
                if (empty($objetivo['descripcion']) || strlen($objetivo['descripcion']) > 150) {
                    $this->sendResponse(false, "Objetivo #" . ($i + 1) . " inválido o demasiado largo", null, 422);
                    exit;
                }
            }
        }

        // Validar centros
        if (!isset($data['centros']) || !is_numeric($data['centros'])) {
            $this->sendResponse(false, "Centro no válido o no seleccionado", null, 422);
            exit;
        }

        //Válido
        return $data;
    }

    

}