<?php
    require_once CONFIG.'configBD.php'; //Archivo de configuración

    
    /**
     * Clase para gestionar la conexión a la base de datos utilizando PDO.
     */
    class bbdd {

        /** @var string $host El servidor de la base de datos. */
        private $host; 

        /** @var string $db El nombre de la base de datos. */
        private $db;

        /** @var string $user El nombre de usuario para la conexión. */
        private $user;
        /** @var string $pass La contraseña para la conexión. */
        private $pass; 
        
        /** @var PDO $conexion La conexión a la base de datos. */
        public $conexion;

        /**
         * Constructor de la clase bbdd.
         * Establece la conexión a la base de datos utilizando las credenciales proporcionadas en el archivo de configuración.
         * Si la conexión es exitosa, crea una instancia de PDO y la asigna a la propiedad $conexion.
         * Si ocurre un error, se captura la excepción y se muestra un mensaje de error.
         * 
         * @throws PDOException Si no se puede establecer la conexión con la base de datos.
         */
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