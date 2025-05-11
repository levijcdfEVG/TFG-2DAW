<?php
    require_once CONFIG.'configBD.php'; //Archivo de configuración

    class bbdd {

        private $host; // Servidor
        private $db; // Nombre BBDD
        private $user; // Nombre usuario
        private $pass; // Contraseña
        public $conexion;

        public function __construct() {		
            $this->host = SERVIDOR;
            $this->db = BBDD;
            $this->user = USUARIO;
            $this->pass = PASSWORD;

            try {
                // Crear una nueva conexión PDO
                $dsn = "mysql:host={$this->host};dbname={$this->db};charset=utf8";
                $this->conexion = new PDO($dsn, $this->user, $this->pass);

                // Configurar el modo de error de PDO para excepciones
                $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // Manejar errores de conexión
                die("Error de conexión: " . $e->getMessage());
            }
        }
    }
?>