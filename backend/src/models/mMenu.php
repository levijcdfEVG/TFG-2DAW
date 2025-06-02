<?php

/**
 * Clase mMenu
 *
 * Esta clase maneja las operaciones relacionadas con los centros educativos en la base de datos.
 * Incluye funciones para listar, insertar, y manejar centros de forma interactiva con la base de datos.
 */

class mMenu {

    // Variable privada para la conexión a la base de datos
    private $conexion;

    /**
     * Conecta a la base de datos.
     *
     * Este método crea una instancia de la clase bbdd y utiliza el método 'conexion' 
     * para obtener la conexión a la base de datos que se usará en las operaciones posteriores.
     *
     * @return void
     */

    public function conectar(){
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }

    /**
     * Obtiene la lista de centros educativos junto con su localidad.
     *
     * Este método consulta la base de datos para obtener todos los centros 
     * de la Fundación, incluyendo el nombre de la localidad asociada a cada uno.
     *
     * @return array Retorna un array con el resultado de la consulta. Si no hay resultados, devuelve un mensaje de error.
     */
    public function userInfo($email){
        $this->conectar(); // Llamar al método conectar para establecer conexión con la base de datos
        
        // Consulta SQL para obtener los centros de la fundación y sus localidades
        $sql = 'SELECT * FROM usuario WHERE correo_user = :email'; // Consulta SQL para obtener los centros de la fundación y sus localidades
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute(); // Ejecutamos la consulta
        
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC); // Obtenemos los resultados como un array asociativo

        // Verificar si hay resultados
        if (empty($resultados)) {
            // Si no se encuentran resultados, se devuelve un mensaje de error
            return ['success' => false, 'message' => 'No se encontraron registros para el email proporcionado.'];
        }
        else {
            // Si hay registros, se retornan los datos
            return ['success' => true, 'data' => $resultados[0]];
        }
    }

    public function getUserByDay(){
        $this->conectar();
        
        try{
            $sql = 'SELECT DATE(fch_registro) AS fecha, COUNT(*) AS cantidad FROM usuario u GROUP BY DATE(fch_registro) ORDER BY fecha;';

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $resultados];
        } catch(PDOException $e){
            return ['success' => false, 'message' => 'Error al obtener los datos: ' . $e->getMessage()];
        }
    }
}

?>