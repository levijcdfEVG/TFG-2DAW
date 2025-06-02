<?php
require_once MODELS . 'mUsuario.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php';
require_once 'helpers/GoogleJWTVerifier.php';

class cUsuario {

    // Método de login con Google
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
                'nuevo_educador' => filter_var($_GET['new_educator'] ?? 2, FILTER_VALIDATE_INT),
                'estado' => filter_var($_GET['status'] ?? 2, FILTER_VALIDATE_INT)
            ];

            $response = $modelo->getUsersByParams($params);

            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getUserById($param): array {
        $modelo = new mUsuario();

        try {
            if (!isset($param['id'])) {
                throw new Exception("ID no proporcionado");
            }

            $id = intval($param['id']);
            $response = $this->mUsuario->getUserById($id);

            if (!$response) {
                return ["success" => false, "error" => "Usuario no encontrado"];
            }

            return ["success" => true, "usuario" => $usuario];

        } catch (Exception $e) {
            return ["success" => false, "error" => "Error en el servidor: " . $e->getMessage()];
        }
    }

        public function deleteUser() {
            try {
                $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) {
                    throw new Exception("ID inválido");
                }
                $response = $this->mUsuario->deleteUser($id);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

    private function sendResponse($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

        public function changeStatus() {
            try {
                $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) {
                    throw new Exception("ID inválido");
                }

                $response = $this->mUsuario->changeStatus($id);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }
    }

    