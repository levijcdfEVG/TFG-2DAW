<?php

/**
 * Clase mCentros
 *
 * Esta clase maneja las operaciones relacionadas con los centros educativos en la base de datos.
 * Incluye funciones para listar, insertar, y manejar centros de forma interactiva con la base de datos.
 */

class mCentros {

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
    public function listaCentros(){
        $this->conectar(); // Llamar al método conectar para establecer conexión con la base de datos
        
        // Consulta SQL para obtener los centros de la fundación y sus localidades
        $sql = 'SELECT cf.*, l.nombre_localidad FROM centro_fundacion cf
	        INNER JOIN localidad l ON cf.id_local = l.id'; 
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
        $stmt->execute(); // Ejecutamos la consulta
        
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC); // Obtenemos los resultados como un array asociativo

        // Verificar si hay resultados
        if (empty($resultados)) {
            // Si no se encuentran resultados, se devuelve un mensaje de error
            return ['success' => false, 'message' => 'No se encontraron registros en la tabla.'];
        }
        else {
            // Si hay registros, se retornan los datos
            return ['success' => true, 'data' => $resultados]; 
        }
    }

    /**
     * Inserta un nuevo centro en la base de datos.
     *
     * Este método recibe los detalles del centro y realiza una serie de validaciones:
     * - Verifica si la localidad existe; si no, la inserta.
     * - Inserta los detalles del centro de la fundación en la tabla correspondiente.
     *
     * @param string $nombreCentro Nombre del centro educativo.
     * @param string $direccionCentro Dirección del centro.
     * @param string $cpCentro Código postal del centro.
     * @param string $localidadCentro Nombre de la localidad.
     * @param string $telefonoCentro Teléfono de contacto del centro.
     * @param string $emailCentro Correo electrónico de contacto del centro.
     *
     * @return array Devuelve el resultado de la inserción con un mensaje de éxito o error.
     */
    public function insertIntoCentros($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro) {
        $this->conectar(); // Conectamos a la base de datos
        try {
            //Verificar que la localidad existe en la base de datos
            $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :localidadCentro';
            $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
            $stmt->execute([':localidadCentro' => $localidadCentro]); // Ejecutamos la consulta con el parámetro
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado como un array asociativo

            if ($resultado) {
                // Si existe la localidad, obtenemos su ID
                $localidadId = $resultado['id'];    
            } else {
                // Si no existe la localidad, la insertamos en la base de datos
                $provincia = substr($cpCentro, 0, 2); // Obtenemos la provincia del código postal
                // Si no existe la localidad, hacemos un insert de la localidad
                $sql = 'INSERT INTO localidad (nombre_localidad, provincia_id) VALUES (:localidadCentro, :provincia)';
                $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
                $stmt->execute([':localidadCentro' => $localidadCentro, ':provincia' => $provincia]); //Ejecutamos la consulta

                // Obtenemos el ID de la localidad recién insertada
                $localidadId = $this->conexion->lastInsertId();
            }

            // Insertamos los datos del centro en la base de datos
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

            // Si la inserción fue exitosa, se devuelve un mensaje de éxito
            return ['success' => true, 'message' => 'Centro insertado correctamente'];
        } catch (PDOException $e) {
            // En caso de error en la base de datos, se captura la excepción y se devuelve un mensaje de error
            return ['success' => false, 'message' => 'Error al insertar el centro: ' . $e->getMessage()];
        }
    }

    /**
     * Modifica los datos de un centro educativo en la base de datos.
     *
     * Este método realiza una transacción en la base de datos para:
     * 1. Verificar si la localidad del centro ya existe; si no, se inserta.
     * 2. Actualizar los datos del centro educativo cuyo correo coincide con el correo de referencia.
     * 
     * La operación se ejecuta dentro de una transacción para garantizar la integridad de los datos.
     * En caso de error, se revierte la transacción (rollback).
     *
     * @param string $emailReferencia Correo electrónico actual del centro que se desea modificar.
     * @param string $nombreCentro Nuevo nombre del centro educativo.
     * @param string $direccionCentro Nueva dirección del centro educativo.
     * @param string $cpCentro Nuevo código postal del centro.
     * @param string $localidadCentro Nombre de la localidad del centro.
     * @param string $telefonoCentro Nuevo teléfono de contacto del centro.
     * @param string $emailCentro Nuevo correo electrónico del centro.
     *
     * @return array Resultado de la operación, incluyendo el éxito o mensaje de error.
     */

    public function modificarCentro($emailReferencia, $nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro) {
    $this->conectar(); // Conectar a la base de datos

    try {
        $this->conexion->beginTransaction();

        // Verificar o insertar la localidad
        $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :localidadCentro';
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':localidadCentro' => $localidadCentro]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {
            $localidadId = $resultado['id'];
        } else {
            $provincia = substr($cpCentro, 0, 2);
            $sql = 'INSERT INTO localidad (nombre_localidad, provincia_id) VALUES (:localidadCentro, :provincia)';
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':localidadCentro' => $localidadCentro, ':provincia' => $provincia]);
            $localidadId = $this->conexion->lastInsertId();
        }

        // Actualizar los datos del centro donde correo_centro coincida con el original
        $sql = "UPDATE centro_fundacion SET
                    nombre_centro = :nombreCentro,
                    direccion_centro = :direccionCentro,
                    cp = :cpCentro,
                    correo_centro = :emailCentro,
                    telefono_centro = :telefonoCentro,
                    id_local = :localidadId
                WHERE correo_centro = :emailReferencia";

        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([
            ':nombreCentro'    => $nombreCentro,
            ':direccionCentro' => $direccionCentro,
            ':cpCentro'        => $cpCentro,
            ':emailCentro'     => $emailCentro,
            ':telefonoCentro'  => $telefonoCentro,
            ':localidadId'     => $localidadId,
            ':emailReferencia' => $emailReferencia
        ]);

        // Confirmar transacción
        $this->conexion->commit();

        return ['success' => true, 'message' => 'Centro modificado con éxito'];
    } catch (PDOException $e) {
        $this->conexion->rollBack();
        return ['success' => false, 'message' => 'Error al modificar el centro: ' . $e->getMessage()];
    }
}

    /**
     * Elimina un centro educativo de la base de datos.
     *
     * Este método recibe un correo electrónico de referencia y elimina el centro correspondiente de la base de datos.
     * 
     * @param string $emailReferencia Correo electrónico de referencia del centro a eliminar.
     *
     * @return array Resultado de la operación, incluyendo el éxito o error de la eliminación.
     */
    public function eliminarCentro($emailReferencia) {
        $this->conectar(); // Conectar a la base de datos
        
        try {
            // Paso 1: Eliminar el centro con el correo de referencia
            $sql = "DELETE FROM centro_fundacion WHERE correo_centro = :emailReferencia";
            $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
            $stmt->execute([':emailReferencia' => $emailReferencia]); // Ejecutamos la consulta
    
            // Si todo fue exitoso, devolver un mensaje de éxito
            return ['success' => true, 'message' => 'Centro eliminado correctamente'];
        } catch (PDOException $e) {
            // Si ocurre un error, manejarlo
            return ['success' => false, 'message' => 'Error al eliminar el centro: ' . $e->getMessage()];
        }
    }

    /**
     * Verifica si una localidad existe dentro de una provincia específica.
     *
     * Este método valida si una localidad existe en la base de datos para una provincia específica.
     * Se usa para comprobar la consistencia entre el código postal y la localidad.
     *
     * @param string $nombreLocalidad Nombre de la localidad a verificar.
     * @param int $idProvincia ID de la provincia en la que se espera que esté la localidad.
     *
     * @return array Resultado de la operación, incluyendo el éxito o error de la validación.
     */

    public function validarLocalidad($nombreLocalidad, $idProvincia) {
        $this->conectar(); // Conectar a la base de datos

        // Consulta para verificar la localidad en la provincia
        $sql = "SELECT * FROM localidad WHERE nombre_localidad = :nombre_localidad AND provincia_id = :id_provincia";
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
        $stmt->execute([':nombre_localidad' => $nombreLocalidad, ':id_provincia' => $idProvincia]); // Ejecutamos la consulta con los parámetros
    
        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Localidad válida']; // Si se encuentra la localidad
        } else {
            return ['success' => false, 'message' => 'La localidad no se enccuentra en la provincia correspondiente al código postal']; //Si no se encuentra la localidad
        }
    }

    /**
     * Valida los datos de un centro educativo antes de su modificación.
     *
     * Este método valida si los datos proporcionados (nombre, dirección, código postal, etc.) coinciden con los datos 
     * existentes en la base de datos. Si no hay cambios, devuelve un mensaje de error.
     *
     * @param string $nombreCentro Nombre del centro educativo.
     * @param string $direccionCentro Dirección del centro educativo.
     * @param string $cpCentro Código postal del centro educativo.
     * @param string $localidadCentro Nombre de la localidad del centro.
     * @param string $telefonoCentro Teléfono de contacto del centro.
     * @param string $emailCentro Correo electrónico del centro.
     *
     * @return array Resultado de la operación, incluyendo el éxito o error de la validación.
     */

    public function validarDatosCentro($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro){
        $this->conectar(); // Conectar a la base de datos

        // Verificar si la localidad existe 
        $sql = "SELECT id FROM localidad WHERE nombre_localidad = :nombre_localidad";
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta SQL
        $stmt->execute([':nombre_localidad' => $localidadCentro]); // Ejecutar la consulta para obtener la localidad

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado 
        
        if ($resultado) {
            
            $localidadId = $resultado['id'];  // Si existe, obtener el ID de la localidad 
        } else {
            return ['success' => false, 'message' => 'La localidad no existe']; // Si no existe, devolver un mensaje de error
        }

        // Verificar si los datos del centro ya están registrados en la base de datos
        $sql = "SELECT * FROM centro_fundacion WHERE nombre_centro = :nombreCentro AND direccion_centro = :direccionCentro AND cp = :cpCentro AND id_local = :localidadId AND telefono_centro = :telefonoCentro AND correo_centro = :emailCentro";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([
            ':nombreCentro' => $nombreCentro,
            ':direccionCentro' => $direccionCentro,
            ':cpCentro' => $cpCentro,
            ':localidadId' => $localidadId,
            ':telefonoCentro' => $telefonoCentro,
            ':emailCentro' => $emailCentro
        ]);
    
        if ($stmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'Los datos del centro no han cambiado']; // Si los datos ya existen
        } else {
            return ['success' => true, 'message' => 'Datos válidos']; // Si los datos son válidos
        }
    }

    /**
     * Verifica si una localidad existe en la base de datos.
     *
     * Este método se utiliza para comprobar si una localidad ya está registrada en la base de datos.
     *
     * @param string $nombreLocalidad Nombre de la localidad a verificar.
     *
     * @return array Resultado de la operación, incluyendo el éxito o error de la verificación.
     */

    public function localidadExiste($nombreLocalidad) {
        $this->conectar(); // Conectar a la base de datos

        // Consultar si la localidad existe
        $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :nombreLocalidad';
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
        $stmt->execute([':nombreLocalidad' => $nombreLocalidad]); // Ejecutamos la consulta con el parámetro
    
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado
    
        if ($resultado) {
            return ['success' => true, 'id' => $resultado['id']]; // Si la localidad existe, retornamos el ID
        } else {
            return ['success' => false, 'message' => 'La localidad no existe']; // Si la localidad no existe
        }
    }
}

?>