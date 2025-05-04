<?php

class mCentros {

    private $conexion;

    public function conectar(){
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }

    public function listaCentros(){
        $this->conectar(); //Llamo al metodo conectar de arriba
        
        $sql = 'SELECT cf.*, l.nombre_localidad FROM centro_fundacion cf
	        INNER JOIN localidad l ON cf.id_local = l.id'; //Escribimos la consulta
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
        $stmt->execute(); // Ejecutamos la consulta
        
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC); // Obtenemos los resultados como un array asociativo

        // Verificar si hay filas
        if (empty($resultados)) {
            return ['success' => false, 'message' => 'No se encontraron registros en la tabla.'];
        }
        else return ['success' => true, 'data' => $resultados]; // Retornar los datos si hay registros
    }
}
?>