<?php
require_once MODELS . 'mLocalidad.php';
require_once 'config/config.php';

class CLocalidad {

    public function __construct() {
        $this->mLocalidad = new MLocalidad();
    }

    public function getAllLocalities() {
        try {
            $response = $this->mLocalidad->getAllLocalities();
            return $response;
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getLocalityByProvince($provinceId) {
        try {
            $localidades = $this->modelo->getLocalityByProvince($provinceId);
            echo json_encode([
                'status' => 'success',
                'data' => $localidades
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getLocalityById($id) {
        try {
            $localidad = $this->modelo->getLocalityById($id);
            if ($localidad) {
                echo json_encode([
                    'status' => 'success',
                    'data' => $localidad
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Localidad no encontrada'
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