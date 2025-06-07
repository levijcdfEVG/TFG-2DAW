<?php

require_once MODELS . 'mRol.php';
require_once 'config/config.php';
require_once 'helpers/auth_helper.php';

class CRol {

    public function __construct() {
        $this->mRol = new MRol();
    }

    public function getAllRoles() {
        verificarTokenYCorreo();
        try {
            $response = $this->mRol->getAllRoles();
            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getRoleById() {
        verificarTokenYCorreo();
        try {
            $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id) {
                throw new Exception('ID de rol no válido');
            }

            $response = $this->mRol->getRoleById($id);
            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function createRole() {
        verificarTokenYCorreo();
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || empty($data['nombre_rol'])) {
                throw new Exception("Datos de rol inválidos");
            }

            $response = $this->mRol->createRole($data);
            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateRole() {
        verificarTokenYCorreo();
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!isset($data['id']) || empty($data['nombre_rol'])) {
                throw new Exception("Datos de rol incompletos");
            }

            $response = $this->mRol->updateRole($data);
            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteRole() {
        verificarTokenYCorreo();
        try {
            $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
            if (!$id) {
                throw new Exception("ID de rol inválido");
            }

            $response = $this->mRol->deleteRole($id);
            echo json_encode($response);
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
