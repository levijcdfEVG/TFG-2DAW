<?php

require_once MODELS . 'mUsuario.php';
require_once MODELS.'mFormacion.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php';
require_once 'helpers/auth_helper.php';

/**
 * Controlador para gestionar las operaciones CRUD de formaciones.
 *
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */
class cFormaciones {
    /**
     * Instancia del modelo MFormacion.
     *
     * @var MFormacion
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    private $mFormacion;

    /**
     * Instancia del modelo MUsuarios.
     *
     * @var mUsuario
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    private $mUsuarios;

    /**
     * Constructor que inicializa el modelo.
     *
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function __construct() {
        $this->mFormacion = new MFormacion();
        $this->mUsuarios = new mUsuario();
    }

    /**
     * Devuelve todas las formaciones en formato JSON.
     * Solo permite método GET.
     *
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function getAllFormaciones() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed(['GET']);
            return;
        }

        verificarTokenYCorreo();

        try {
            $response = $this->mFormacion->listarAllFormaciones();
            echo json_encode($response);
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }

    /**
     * Crea una nueva formación a partir de datos JSON enviados.
     * Comenta validación método HTTP por si quieres usar otros métodos.
     *
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function crearFormacion() {
        // if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        //     $this->methodNotAllowed(['POST']);
        //     return;
        // }

        verificarTokenYCorreo();

        try {
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            if (!$data) {
                $this->sendResponse(false, 'Datos JSON no válidos o mal formateados', null, 400);
                return;
            }

            $validatedData = $this->validateForm($data);
            $resultado = $this->mFormacion->insertarFormacion($validatedData);

            if ($resultado['success']) {
                $this->sendResponse(true, 'Formación creada correctamente', $resultado, 201);
            } else {
                $this->sendResponse(false, 'Error al crear formación', $resultado, 400);
            }
        } catch (Exception $e) {
            $this->sendResponse(false, 'Error inesperado: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Actualiza una formación existente con datos JSON recibidos.
     * Comenta validación método HTTP PUT.
     *
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function updateFormacion() {
        // if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        //     $this->methodNotAllowed(['PUT']);
        //     return;
        // }

        verificarTokenYCorreo();

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['id']) || empty($input['id'])) {
                $this->sendResponse(false, 'Falta el ID de la formación', null, 400);
                return;
            }

            $idFormacion = (int)$input['id'];
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

    /**
     * Desactiva una formación según su ID enviado en JSON.
     * Comenta validación método HTTP PUT.
     *
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function desactivarFormacion() {
        // if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        //     $this->methodNotAllowed(['PUT']);
        //     return;
        // }

        verificarTokenYCorreo();

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

    /**
     * Borra una formación según su ID recibido en JSON.
     * Permite solo método DELETE.
     *
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function borrarFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->methodNotAllowed(['DELETE']);
            return;
        }

        verificarTokenYCorreo();

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

    //Metodos para manejo de inscripciones

    /**
     * Asigna uno o varios usuarios a una formación específica.
     *
     * Procesa una solicitud JSON que debe contener el ID de la formación y un array de IDs de usuarios.
     * Valida los datos recibidos y llama al modelo para realizar la asignación.
     * Devuelve una respuesta JSON indicando el resultado de la operación.
     *
     * @return void
     *
     * @throws Exception Si ocurre un error inesperado durante el proceso.
     *
     * Ejemplo de entrada JSON:
     * {
     *   "idFormacion": 1,
     *   "idsUsuarios": [2, 3, 4]
     * }
     */
   public function asignUserFormacion() {
        verificarTokenYCorreo();
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['idFormacion']) || !isset($input['idsUsuarios']) || !is_array($input['idsUsuarios']) || empty($input['idsUsuarios'])) {
                $this->sendResponse(false, 'Faltan datos obligatorios (idFormacion o idsUsuarios)', null, 400);
                return;
            }

            $idFormacion = (int)$input['idFormacion'];
            $idsUsuarios = array_map('intval', $input['idsUsuarios']);

            $response = $this->mFormacion->asignarUsuarioAFormacion($idFormacion, $idsUsuarios);

            if ($response['success']) {
                $this->sendMails('alta', $idFormacion, $idsUsuarios);
                $this->sendResponse(true, $response['message'] ?? 'Usuarios asignados correctamente.');
            } else {
                $this->sendResponse(false, $response['message'] ?? 'No se pudo asignar a los usuarios.', null, 500);
            }

        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }



    /**
     * Obtiene los usuarios inscritos en una formación específica.
     *
     * Este método espera una petición GET con el parámetro `idFormacion` en la URL.
     * Llama al modelo para recuperar los usuarios asociados a la formación y devuelve
     * una respuesta JSON con los resultados.
     *
     * @return void
     *
     * @throws Exception Si ocurre un error inesperado durante el proceso.
     *
     */
    public function getUsersByFormacion(){
        // if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        //     $this->methodNotAllowed(['GET']);
        //     return;
        // }
        verificarTokenYCorreo();
        try {
            if (!isset($_GET['idFormacion']) || empty($_GET['idFormacion'])) {
                $this->sendResponse(false, 'Falta el parámetro idFormacion', null, 400);
                return;
            }

            $idFormacion = (int)$_GET['idFormacion'];
            $resultado = $this->mFormacion->getUsuariosPorFormacion($idFormacion);

            if (!$resultado['success']) {
                $this->sendResponse(false, $resultado['message'] ?? 'Error desconocido', null, 500);
                return;
            }

            $this->sendResponse(true, 'Usuarios obtenidos correctamente', $resultado['usuarios']);
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }

    /**
     * Obtiene las formaciones de un usuario específico.
     *
     * Este método espera una petición GET con el parámetro `id` en la URL.
     * Llama al modelo para recuperar las formaciones asociadas al usuario y devuelve
     * una respuesta JSON con los resultados.
     *
     * @return void
     *
     * @throws Exception Si ocurre un error inesperado durante el proceso.
     *
     */
    public function getFormationByUserId($params) {
        try {
            if (!isset($_GET['id']) || empty($_GET['id'])) {
                $this->sendResponse(false, 'Falta el parámetro id', null, 400);
                return;
            }

            $idUsuario = (int)$_GET['id'];
            $resultado = $this->mFormacion->getFormationByUserId($idUsuario);

            if (!$resultado['success']) {
                $this->sendResponse(false, $resultado['message'] ?? 'Error desconocido', null, 500);
                return;
            }

            $this->sendResponse(true, 'Formaciones obtenidas correctamente', $resultado['formaciones']);
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }
    
    /**
     * Desasigna uno o varios usuarios de una formación específica.
     *
     * Procesa una solicitud JSON que debe contener el ID de la formación y un array de IDs de usuarios.
     * Valida los datos recibidos y llama al modelo para realizar la eliminación de las inscripciones.
     * Devuelve una respuesta JSON indicando el resultado de la operación.
     *
     * @return void
     *
     * @throws Exception Si ocurre un error inesperado durante el proceso.
     *
     * Ejemplo de entrada JSON:
     * {
     *   "idFormacion": 1,
     *   "idsUsuarios": [2, 3]
     * }
     */
    public function unasignUsersByFormacion() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed(['POST']);
            return;
        }

        verificarTokenYCorreo();

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['idFormacion']) || !isset($input['idsUsuarios']) || !is_array($input['idsUsuarios']) || empty($input['idsUsuarios'])) {
                $this->sendResponse(false, 'Faltan datos obligatorios (idFormacion o idsUsuarios)', null, 400);
                return;
            }

            $idFormacion = (int)$input['idFormacion'];
            $idsUsuarios = array_map('intval', $input['idsUsuarios']);

            $response = $this->mFormacion->desasignarUsuariosFormacion($idFormacion, $idsUsuarios);

            if ($response['success']) {
                $this->sendMails('baja', $idFormacion, $idsUsuarios);
                $this->sendResponse(true, $response['message'] ?? 'Usuarios desasignados correctamente.');
            } else {
                $this->sendResponse(false, $response['message'] ?? 'No se pudo desasignar a los usuarios.', null, 500);
            }
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage(), null, 500);
        }
    }

    public function cambiarEstado(){


    }

    /**
     * Envía la respuesta JSON al cliente con cabeceras HTTP y código de estado.
     *
     * @param bool $success Indica éxito o fallo.
     * @param string $message Mensaje de la respuesta.
     * @param mixed|null $data Datos adicionales (opcional).
     * @param int $statusCode Código HTTP (por defecto 200).
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    private function sendResponse(bool $success, string $message = '', $data = null, int $statusCode = 200) {
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

    /**
     * Envía respuesta HTTP 405 con métodos permitidos.
     *
     * @param array $allowed Array de métodos HTTP permitidos.
     * @return void
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    private function methodNotAllowed(array $allowed) {
        header('Allow: ' . implode(', ', $allowed));
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido. Usa: ' . implode(', ', $allowed)]);
        exit;
    }

    /**
     * Valida los datos de formación recibidos.
     * Verifica campos obligatorios, tipos y tamaños máximos.
     *
     * @param array $data Datos recibidos para validar.
     * @return array Datos validados (si pasan las comprobaciones).
     * @throws void Termina la ejecución y envía respuesta si falla validación.
     *
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
   private function validateForm(array $data): array {
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

        if (!is_numeric($formacion['duracion'])) {
            $this->sendResponse(false, "La duración debe ser un número", null, 422);
            exit;
        }

        if (empty($data['cursos']) || !is_array($data['cursos'])) {
            $this->sendResponse(false, "Debes seleccionar al menos un curso académico", null, 422);
            exit;
        }

        if (!empty($data['modulos']) && is_array($data['modulos'])) {
            foreach ($data['modulos'] as $i => $modulo) {
                if (empty($modulo['nombre_modulo']) || strlen($modulo['nombre_modulo']) > 50) {
                    $this->sendResponse(false, "Módulo #" . ($i + 1) . " inválido o demasiado largo", null, 422);
                    exit;
                }
            }
        }

        if (!empty($data['objetivos']) && is_array($data['objetivos'])) {
            foreach ($data['objetivos'] as $i => $objetivo) {
                if (empty($objetivo['descripcion']) || strlen($objetivo['descripcion']) > 150) {
                    $this->sendResponse(false, "Objetivo #" . ($i + 1) . " inválido o demasiado largo", null, 422);
                    exit;
                }
            }
        }

        if (!isset($data['centros']) || !is_numeric($data['centros'])) {
            $this->sendResponse(false, "Centro no válido o no seleccionado", null, 422);
            exit;
        }

        return $data;
   }

    /**
     * Envía correos electrónicos a una lista de usuarios relacionados con una formación específica.
     *
     * @param string $tipoCorreo   Tipo de correo a enviar (por ejemplo, notificación, recordatorio, etc.).
     * @param int    $idFormacion  ID de la formación asociada al correo.
     * @param array  $idsUsuarios  Array de IDs de usuarios a los que se enviará el correo.
     *
     * @return void
     */
    private function sendMails($tipoCorreo, $idFormacion, $idsUsuarios) {
        $nombreFormacionResponse = $this->mFormacion->getFormacionById($idFormacion);
        $nombreFormacion = $nombreFormacionResponse['success'] ? $nombreFormacionResponse['nombre'] : 'una formación';

        foreach ($idsUsuarios as $idUsuario) {
            $usuario = $this->mUsuarios->obtenerUsuarioPorId($idUsuario);
            if ($usuario && isset($usuario['correo_user'])) {
                $email = $usuario['correo_user'];
                $nombre = $usuario['nombre_user'] ?? 'Usuario';

                $asunto = "Asignación a formación";
                $data = [
                    'to'        => $email,
                    'subject'   => $asunto,
                    'nombre'    => $nombre,
                    'formacion' => $nombreFormacion,
                    'tipo'      => $tipoCorreo
                ];

                $content = json_encode($data, JSON_UNESCAPED_UNICODE);
                $options = [
                    'http' => [
                        'method'  => 'POST',
                        'header'  => "Content-type: application/json\r\n" .
                                    "Content-Length: " . strlen($content) . "\r\n",
                        'content' => $content
                    ]
                ];

                $context = stream_context_create($options);
                $result = file_get_contents(GOOGLEMAILER, false, $context);

                if ($result === FALSE) {
                    error_log("No se pudo enviar email al usuario ID {$idUsuario} ({$email})");
                }
            }
        }
    }

}
