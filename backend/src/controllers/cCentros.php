<?php
    require_once MODELS.'mCentros.php';

    class cCentros {

        public function __construct() {

            $this->objCentro = new mCentros();
        }

        public function listaCentros(){
            return $this->objCentro->listaCentros();
        }
    }

?>