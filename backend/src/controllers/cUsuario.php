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

    public function getUserByid($param): array {
        $modelo = new mUsuario();

        try {
            if (!isset($param['id'])) {
                throw new Exception("ID no proporcionado");
            }

            $id = intval($param['id']);
            $usuario = $modelo->getUsuarioPorId($id);

            if (!$usuario) {
                return ["success" => false, "error" => "Usuario no encontrado"];
            }

            return ["success" => true, "usuario" => $usuario];

        } catch (Exception $e) {
            return ["success" => false, "error" => "Error en el servidor: " . $e->getMessage()];
        }
    }

    private function sendResponse($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

}
