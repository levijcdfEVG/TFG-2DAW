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

    public function insertIntoCentros($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro) {
        $this->conectar(); // Conectar a la base de datos
        try {
            //Verificar que la localidad existe
            $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :localidadCentro';
            $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
            $stmt->execute([':localidadCentro' => $localidadCentro]); // Ejecutamos la consulta con el parámetro
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado como un array asociativo

            if ($resultado) {
                // Si existe la localidad, obtenemos su ID
                $localidadId = $resultado['id'];    
            } else {
                $provincia = substr($cpCentro, 0, 2); // Obtenemos la provincia del código postal
                // Si no existe la localidad, hacemos un insert de la localidad
                $sql = 'INSERT INTO localidad (nombre_localidad, provincia_id) VALUES (:localidadCentro, :provincia)';
                $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
                $stmt->execute([':localidadCentro' => $localidadCentro, ':provincia' => $provincia]); //

                // Obtenemos el ID de la localidad recién insertada
                $localidadId = $this->conexion->lastInsertId();
            }

            $sql = 'INSERT INTO centro_fundacion (nombre_centro, direccion_centro, cp, correo_centro, telefono_centro, id_local)
                VALUES (:nombreCentro, :direccionCentro, :cpCentro, :emailCentro, :telefonoCentro, :localidadId)';
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':nombreCentro' => $nombreCentro,
                ':direccionCentro' => $direccionCentro,
                ':cpCentro' => $cpCentro,
                ':emailCentro' => $emailCentro,
                ':telefonoCentro' => $telefonoCentro,
                ':localidadId' => $localidadId
            ]);

            // Si todo fue exitoso, devolver un mensaje de éxito
            return ['success' => true, 'message' => 'Centro insertado correctamente'];
        } catch (PDOException $e) {
            // Manejar errores de la base de datos
            return ['success' => false, 'message' => 'Error al insertar el centro: ' . $e->getMessage()];
        }
    }

    public function modificarCentro($emailReferencia, $nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro) {
        $this->conectar();

        try{
            $this->conexion->beginTransaction();

            //Paso 1: borrar el centro con el email de referencia
            $sql = "DELETE FROM centro_fundacion WHERE correo_centro = :emailReferencia";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':emailReferencia' => $emailReferencia]);
    
            //Paso 2: verificar si la localidad existe
            $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :localidadCentro';
            $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
            $stmt->execute([':localidadCentro' => $localidadCentro]); // Ejecutamos la consulta con el parámetro
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado como un array asociativo
    
            if ($resultado) {
                // Si existe la localidad, obtenemos su ID
                $localidadId = $resultado['id'];    
            } else {
                $provincia = substr($cpCentro, 0, 2); // Obtenemos la provincia del código postal
                // Si no existe la localidad, hacemos un insert de la localidad
                $sql = 'INSERT INTO localidad (nombre_localidad, provincia_id) VALUES (:localidadCentro, :provincia)';
                $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
                $stmt->execute([':localidadCentro' => $localidadCentro, ':provincia' => $provincia]); //
    
                // Obtenemos el ID de la localidad recién insertada
                $localidadId = $this->conexion->lastInsertId();
            }
    
            //Paso 3: insertar el nuevo centro
            $sql = "INSERT INTO centro_fundacion 
                    (nombre_centro, direccion_centro, cp, correo_centro, telefono_centro, id_local)
                    VALUES (:nombreCentro, :direccionCentro, :cpCentro, :emailCentro, :telefonoCentro, :localidadId)";        
            $stmt = $this->conexion->prepare($sql);
            
            // Ejecutar la consulta con los datos proporcionados
            $stmt->execute([
                ':nombreCentro' => $nombreCentro, 
                ':direccionCentro' => $direccionCentro, 
                ':cpCentro' => $cpCentro, 
                ':emailCentro' => $emailCentro, 
                ':telefonoCentro' => $telefonoCentro, 
                ':localidadId' => $localidadId
            ]);
            // Confirmar la transacción
            $this->conexion->commit();
            return ['success' => true, 'message' => 'Centro modificado con éxito'];
        } catch (PDOException $e) {
            // Si ocurre un error, hacer rollback
            $this->conexion->rollBack();
            return ['success' => false, 'message' => 'Error al modificar el centro: ' . $e->getMessage()];
        }
    }
}

?>