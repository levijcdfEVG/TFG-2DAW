<?php 

    require_once MODELS . 'mUsuario.php';
    require_once 'config/config.php';

    class CUsuario {

        public function __construct() {
            $this->mUsuario = new MUsuario();
        }

        public function getUsersByParams() {

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

                $response = $this->mUsuario->getUsersByParams($params);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        public function getUserById() {
            try {
                $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) {
                    throw new Exception('ID de usuario no válido');
                }

                $response = $this->mUsuario->getUserById($id);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        public function createUser() {
            try {
                $data = json_decode(file_get_contents("php://input"), true);

                if (!$data) {
                    throw new Exception("Datos inválidos");
                }

                $response = $this->mUsuario->createUser($data);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        public function updateUser() {
            try {
                $data = json_decode(file_get_contents("php://input"), true);

                if (!isset($data['id'])) {
                    throw new Exception("ID requerido para actualizar");
                }

                $response = $this->mUsuario->updateUser($data);
                return $response;
            } catch (Exception $e) {
                return ['success' => false, 'message' => $e->getMessage()];
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