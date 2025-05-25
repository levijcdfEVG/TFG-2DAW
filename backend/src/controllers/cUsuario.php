<?php 

    require_once MODELS . 'mUsuario.php';
    require_once 'config/config.php';

    class CUsuario {

        public function __construct() {
            $this->mUsuario = new MUsuario();
        }

        public function getUsersByParams() {
//             if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
//                 $this->methodNotAllowed(['GET']);
//                 return;
//             }

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
    }