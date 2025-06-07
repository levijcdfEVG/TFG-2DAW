<?php
require_once MODELS . 'mProvincia.php';
require_once 'config/config.php';
require_once 'helpers/auth_helper.php';

class CProvincia {

    public function __construct() {
        $this->mProvincia = new MProvincia();
    }

    public function getAllProvinces() {
        verificarTokenYCorreo();
        try {
            $response = $this->mProvincia->getAllProvinces();
            return $response;
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getProvinceById($id) {
        verificarTokenYCorreo();
        try {
            $provincia = $this->modelo->getProvinceById($id);
            if ($provincia) {
                echo json_encode([
                    'status' => 'success',
                    'data' => $provincia
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Provincia no encontrada'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
} 