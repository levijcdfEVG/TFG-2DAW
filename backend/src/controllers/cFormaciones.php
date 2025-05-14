<?php 

require_once MODELS.'mFormacion.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config/config.php';

Class cFormaciones {


    public function __construct(){
        $this->mFormacion = new MFormacion();
    }

    public function getAllFormaciones() {
        try {
            $response = $this->mFormacion->listarAllFormaciones();
            if ($response === false || $response === null) {
                $this->sendResponse(['error' => 'No se pudieron obtener las formaciones'], 500);
            } else {
                $this->sendResponse($response);
            }
        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }


    private function sendResponse($response, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($response);
    }
    

}