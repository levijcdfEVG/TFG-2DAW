<?php
    require_once MODELS.'mCentros.php';

    class cCentros {

        public function __construct() {

            $this->objCentro = new mCentros();
        }

        public function listaCentros(){
            $resultado = $this->objCentro->listaCentros();

            // Devolver los datos en formato JSON
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }
    }

?>