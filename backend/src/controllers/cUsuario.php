<?php
require_once MODELS . 'mUsuario.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php';
require_once 'helpers/GoogleJWTVerifier.php';

    /**
     * Controlador de usuarios.
     *
     * Gestiona las solicitudes relacionadas con los usuarios, incluyendo autenticación,
     * creación, modificación y eliminación de usuarios del sistema.
     *
     * @category Controlador
     * @package  TFG-2DAW
     * @author   Álvaro Gómez Delgado <aagomezdelgado.guadalupe@alumnado.fundacionloyola.net>
     * @license  https://opensource.org/licenses/MIT MIT License
     * @link     http://example.com
     */
    class cUsuario {

    /**
     * Método de login con Google
     *
     * Este método verifica un token de Google y si es válido, intenta loguear al usuario asociado.
     * Si el usuario no existe, lo crea en la base de datos.
     *
     * @return array - Devuelve un array asociativo con dos claves: "success" y "error".
     *                  - "success" es booleano y indica si la operación fue exitosa o no.
     *                  - "error" es un string que contiene el mensaje de error si "success" es false.
     * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
     */
    public function loginGoogle(): array {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $modelo = new mUsuario();

                $token = $data["token"] ?? null;
                if (!$token) {
                    return $this->sendResponse(["success" => false, "error" => "Token no recibido"]);
                }

                $decoded = GoogleJWTVerifier::verify($token);
                if (!$decoded) {
                    return $this->sendResponse(["success" => false, "error" => "Token inválido o expirado"]);
                }

                $correo = $decoded['email'] ?? null;
                if (!$correo) {
                    return $this->sendResponse(["success" => false, "error" => "Correo no disponible en el token"]);
                }

                $usuario = $modelo->getUsuarioPorCorreo($correo);
                if (!$usuario) {
                    return $this->sendResponse(["success" => false, "error" => "Correo no autorizado"]);
                }

                return $this->sendResponse(["success" => true, "token" => $token]);

            } catch (Exception $e) {
                return $this->sendResponse(["success" => false, "error" => "Error en el servidor: " . $e->getMessage()]);
            }
        }

        /**
         * Obtiene usuarios filtrados por diferentes parámetros.
         *
         * Este método permite buscar usuarios aplicando filtros como nombre, apellido,
         * correo, teléfono, rol y estado. Los parámetros se reciben por GET y se
         * sanitizan antes de realizar la búsqueda.
         *
         * @return array Lista de usuarios que coinciden con los criterios de búsqueda.
         */
        public function getUsersByParams() {
            $modelo = new mUsuario();

            try {
                // Validación y sanitización de parámetros
                $params = [
                    'nombre_user' => filter_var($_GET['name'] ?? '', FILTER_SANITIZE_STRING),
                    'apellido_user' => filter_var($_GET['surname'] ?? '', FILTER_SANITIZE_STRING),
                    'correo_user' => filter_var($_GET['email'] ?? '', FILTER_SANITIZE_EMAIL),
                    'telefono_user' => filter_var($_GET['phone'] ?? '', FILTER_SANITIZE_STRING),
                    'id_rol' => filter_var($_GET['role'] ?? '', FILTER_SANITIZE_STRING),
                    'nuevo_educador' => filter_var($_GET['new_educator'] ?? 0, FILTER_VALIDATE_INT),
                    'estado' => filter_var($_GET['status'] ?? 2, FILTER_VALIDATE_INT)
                ];

                $response = $modelo->getUsersByParams($params);

                echo json_encode($response);
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

       public function getUsersByCentro() {
            $modelo = new mUsuario();

            try {
                // Validar y sanitizar idCentro (es lo único que realmente necesitamos desde el frontend)
                $idCentro = filter_var($_GET['idCentro'] ?? null, FILTER_VALIDATE_INT);

                // Validación de seguridad: debe existir idCentro
                if (!$idCentro) {
                    return $this->sendResponse([
                        'success' => false,
                        'message' => 'idCentro no proporcionado o inválido'
                    ]);
                }

                // Aquí podrías validar el rol usando sesión, JWT, etc. Si lo recibes como parámetro, úsalo solo si es seguro.
                // Por ahora asumimos que si se llama este endpoint, es porque ya se comprobó que el usuario tiene idRol === 3

                // Recolectar los parámetros del filtro
                $params = [
                    'id_centro' => $idCentro,
                    'nombre_user' => filter_var($_GET['name'] ?? '', FILTER_SANITIZE_STRING),
                    'apellido_user' => filter_var($_GET['surname'] ?? '', FILTER_SANITIZE_STRING),
                    'correo_user' => filter_var($_GET['email'] ?? '', FILTER_SANITIZE_EMAIL),
                    'telefono_user' => filter_var($_GET['phone'] ?? '', FILTER_SANITIZE_STRING),
                    'id_rol' => filter_var($_GET['role'] ?? '', FILTER_SANITIZE_STRING),
                    'nuevo_educador' => filter_var($_GET['new_educator'] ?? 0, FILTER_VALIDATE_INT),
                    'estado' => filter_var($_GET['status'] ?? 2, FILTER_VALIDATE_INT)
                ];

                $response = $modelo->getUsersByCentro($params);
                // El modelo debe devolver ya el array con: success, message y data
                return $this->sendResponse($response);

            } catch (Exception $e) {
                return $this->sendResponse([
                    'success' => false,
                    'message' => 'Error del servidor: ' . $e->getMessage()
                ]);
            }
        }


        /**
         * Crea un nuevo usuario en el sistema.
         *
         * Este método recibe los datos del nuevo usuario en formato JSON y los
         * valida antes de proceder con la creación en la base de datos.
         *
         * @return array Resultado de la operación de creación.
         */
        public function createUser() {
            try {
                $data = json_decode(file_get_contents("php://input"), true);
                $modelo = new mUsuario();

                if (!$data) {
                    throw new Exception("Datos inválidos");
                }

                $response = $modelo->createUser($data);
                echo json_encode($response);
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        /**
         * Actualiza los datos de un usuario existente.
         *
         * Este método recibe los datos actualizados del usuario en formato JSON y los
         * valida antes de proceder con la actualización en la base de datos.
         *
         * @return array Resultado de la operación de actualización.
         */
        public function updateUser() {
            try {
                $data = json_decode(file_get_contents("php://input"), true);
                $modelo = new mUsuario();

                if (!$data) {
                    throw new Exception("Datos inválidos");
                }

                if (!isset($data['id'])) {
                    throw new Exception("ID de usuario requerido para actualizar");
                }

                $response = $modelo->updateUser($data);
                echo json_encode($response);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            }
        }

        /**
         * Obtiene la información de un usuario específico por su ID.
         *
         * Este método recibe el ID del usuario y devuelve toda su información
         * si existe en el sistema.
         *
         * @param array $params Array que contiene el ID del usuario a buscar.
         * @return array Información del usuario o mensaje de error si no existe.
         */
        public function getUserById($params) {
            $modelo = new mUsuario();

            try {
                if (!is_array($params) || !isset($params['id'])) {
                    return $this->sendResponse(["success" => false, "error" => "ID no proporcionado o formato inválido"]);
                }

                $id = filter_var($params['id'], FILTER_VALIDATE_INT);
                if ($id === false || $id <= 0) {
                    return $this->sendResponse(["success" => false, "error" => "ID inválido. Debe ser un número entero positivo"]);
                }

                $response = $modelo->getUserById($id);

                if (!$response['success']) {
                    return $this->sendResponse(["success" => false, "error" => $response['message']]);
                }

                return $this->sendResponse(["success" => true, "data" => $response['data']]);

            } catch (Exception $e) {
                return $this->sendResponse(["success" => false, "error" => "Error en el servidor: " . $e->getMessage()]);
            }
        }

        /**
         * Cambia el estado de un usuario (activo/inactivo).
         *
         * Este método permite alternar el estado de un usuario entre activo e inactivo.
         * El cambio se realiza mediante un toggle del valor actual.
         *
         * @return array Resultado de la operación de cambio de estado.
         */
        public function changeStatus($params) {
            $modelo = new mUsuario();

            try {
                if (!is_array($params) || !isset($params['id'])) {
                    return $this->sendResponse(["success" => false, "error" => "ID no proporcionado o formato inválido"]);
                }

                $id = filter_var($params['id'], FILTER_VALIDATE_INT);
                if ($id === false || $id <= 0) {
                    return $this->sendResponse(["success" => false, "error" => "ID inválido. Debe ser un número entero positivo"]);
                }

                // Verificar que el usuario existe antes de cambiar su estado
                $user = $modelo->getUserById($id);
                if (!$user['success']) {
                    return $this->sendResponse(["success" => false, "error" => "Usuario no encontrado"]);
                }

                $response = $modelo->changeStatus($id);

                if (!$response['success']) {
                    return $this->sendResponse(["success" => false, "error" => $response['message']]);
                }

                return $this->sendResponse(["success" => true, "message" => "Estado del usuario actualizado correctamente"]);

            } catch (Exception $e) {
                return $this->sendResponse(["success" => false, "error" => "Error en el servidor: " . $e->getMessage()]);
            }
        }

        /**
         * Elimina un usuario del sistema.
         *
         * Este método recibe el ID del usuario a eliminar y procede con su
         * eliminación de la base de datos.
         *
         * @return array Resultado de la operación de eliminación.
         */
        public function deleteUser() {
            try {
                $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) {
                    throw new Exception("ID inválido");
                }
                $response = $this->mUsuario->deleteUser($id);
                echo json_encode($response);
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        /**
         * Envía una respuesta JSON al cliente.
         *
         * Este método auxiliar establece las cabeceras HTTP apropiadas y
         * envía la respuesta en formato JSON.
         *
         * @param array $data Datos a enviar en la respuesta.
         * @return void
         */
        private function sendResponse($data) {
            header('Content-Type: application/json');
            echo json_encode($data);
            exit;
        }
}
?>