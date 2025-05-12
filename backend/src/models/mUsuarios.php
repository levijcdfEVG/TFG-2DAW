<?php

class mUsuarios {

    private $conexion;

    public function conectar(){
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }

    public function listaUsuarios($page = 1, $limit = 10, $filtros = []) {
        $this->conectar();
        $offset = ($page - 1) * $limit;
        $where = [];
        $params = [];
        // Filtros dinámicos
        if (!empty($filtros['nombre'])) {
            $where[] = 'nombre_user LIKE :nombre';
            $params[':nombre'] = '%' . $filtros['nombre'] . '%';
        }
        if (!empty($filtros['apellidos'])) {
            $where[] = 'apellido_user LIKE :apellidos';
            $params[':apellidos'] = '%' . $filtros['apellidos'] . '%';
        }
        if (!empty($filtros['email'])) {
            $where[] = 'correo_user LIKE :email';
            $params[':email'] = '%' . $filtros['email'] . '%';
        }
        if (!empty($filtros['telefono'])) {
            $where[] = 'telefono_user LIKE :telefono';
            $params[':telefono'] = '%' . $filtros['telefono'] . '%';
        }
        if (isset($filtros['rol']) && $filtros['rol'] !== '') {
            $where[] = 'id_rol = :rol';
            $params[':rol'] = $filtros['rol'];
        }
        if (isset($filtros['estado']) && $filtros['estado'] !== '' && $filtros['estado'] !== null) {
            $where[] = 'activo = :estado';
            $params[':estado'] = $filtros['estado'] ? 1 : 0;
        }
        if (isset($filtros['nuevo_educador']) && $filtros['nuevo_educador'] !== '' && $filtros['nuevo_educador'] !== null) {
            $where[] = 'nuevo_educador = :nuevo_educador';
            $params[':nuevo_educador'] = $filtros['nuevo_educador'] ? 1 : 0;
        }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
        $sql = "SELECT * FROM usuario $whereSql LIMIT :limit OFFSET :offset";
        $stmt = $this->conexion->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':limit', (int)$limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, \PDO::PARAM_INT);
        $stmt->execute();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Total para paginación
        $sqlTotal = "SELECT COUNT(*) as total FROM usuario $whereSql";
        $stmtTotal = $this->conexion->prepare($sqlTotal);
        foreach ($params as $k => $v) {
            $stmtTotal->bindValue($k, $v);
        }
        $stmtTotal->execute();
        $total = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];
        return [
            'success' => true,
            'users' => $usuarios,
            'total' => (int)$total
        ];
    }

    public function insertIntoUsuarios($nombre, $apellidos, $email, $telefono, $dni) {
        $this->conectar();
        try {
            $sql = 'INSERT INTO usuario (nombre_user, apellido_user, correo_user, telefono_user, id_rol) VALUES (:nombre, :apellidos, :email, :telefono, 2)';
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':nombre' => $nombre,
                ':apellidos' => $apellidos,
                ':email' => $email,
                ':telefono' => $telefono
            ]);
            return ['success' => true, 'message' => 'Usuario insertado correctamente'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al insertar el usuario: ' . $e->getMessage()];
        }
    }

    public function modificarUsuario($emailReferencia, $nombre, $apellidos, $email, $telefono, $dni) {
        $this->conectar();
        try {
            $sql = 'UPDATE usuario SET nombre_user = :nombre, apellido_user = :apellidos, correo_user = :email, telefono_user = :telefono WHERE correo_user = :emailReferencia';
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':nombre' => $nombre,
                ':apellidos' => $apellidos,
                ':email' => $email,
                ':telefono' => $telefono,
                ':emailReferencia' => $emailReferencia
            ]);
            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Usuario modificado con éxito'];
            } else {
                return ['success' => false, 'message' => 'No se modificó ningún usuario (puede que el correo de referencia no exista o los datos sean iguales)'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al modificar el usuario: ' . $e->getMessage()];
        }
    }

    public function eliminarUsuario($emailReferencia) {
        $this->conectar();
        try {
            $sql = 'DELETE FROM usuario WHERE correo_user = :emailReferencia';
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':emailReferencia' => $emailReferencia]);
            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Usuario eliminado correctamente'];
            } else {
                return ['success' => false, 'message' => 'No se eliminó ningún usuario (puede que el correo no exista)'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al eliminar el usuario: ' . $e->getMessage()];
        }
    }

    public function buscarUsuarios($filtros) {
        // Reutiliza listaUsuarios pero sin paginación
        return $this->listaUsuarios(1, 1000, $filtros); // Devuelve hasta 1000 resultados
    }

    public function validarUsuario($dni, $email) {
        $this->conectar();
        $sql = 'SELECT id FROM usuario WHERE correo_user = :email';
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':email' => $email]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return ['success' => false, 'message' => 'El usuario ya existe con ese email'];
        }
        // TODO: Validar DNI si es necesario
        return ['success' => true, 'message' => 'Usuario válido'];
    }

    public function rolExiste($idRol) {
        $this->conectar();
        $sql = 'SELECT id FROM roles WHERE id = :idRol AND activo = 1';
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':idRol' => $idRol]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return ['success' => true];
        } else {
            return ['success' => false, 'message' => 'El rol no existe'];
        }
    }

    public function usuarioUnico($correo) {
        $this->conectar();
        $sql = 'SELECT id FROM usuario WHERE correo_user = :correo';
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':correo' => $correo]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return ['success' => false, 'message' => 'El usuario ya existe'];
        } else {
            return ['success' => true];
        }
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

    public function eliminarCentro($emailReferencia) {
        $this->conectar(); // Conectar a la base de datos
        try {
            // Paso 1: borrar el centro con el email de referencia
            $sql = "DELETE FROM centro_fundacion WHERE correo_centro = :emailReferencia";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':emailReferencia' => $emailReferencia]);

            // Si todo fue exitoso, devolver un mensaje de éxito
            return ['success' => true, 'message' => 'Centro eliminado correctamente'];
        } catch (PDOException $e) {
            // Manejar errores de la base de datos
            return ['success' => false, 'message' => 'Error al eliminar el centro: ' . $e->getMessage()];
        }
    }

    public function validarLocalidad($nombreLocalidad, $idProvincia) {
        $this->conectar();
        $sql = "SELECT * FROM localidad WHERE nombre_localidad = :nombre_localidad AND provincia_id = :id_provincia";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':nombre_localidad' => $nombreLocalidad, ':id_provincia' => $idProvincia]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Localidad válida'];
        } else {
            return ['success' => false, 'message' => 'La localidad no se enccuentra en la provincia correspondiente al código postal'];
        }
    }

    public function validarDatosCentro($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro){
        $this->conectar(); // Conectar a la base de datos
        $sql = "SELECT id FROM localidad WHERE nombre_localidad = :nombre_localidad";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':nombre_localidad' => $localidadCentro]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado como un array asociativo
        if ($resultado) {
            // Si existe la localidad, obtenemos su ID
            $localidadId = $resultado['id'];
        } else {
            return ['success' => false, 'message' => 'La localidad no existe'];
        }
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
            return ['success' => false, 'message' => 'Los datos del centro no han cambiado'];
        } else {
            return ['success' => true, 'message' => 'Datos válidos'];
        }
    }

    public function localidadExiste($nombreLocalidad) {
        $this->conectar(); // Conectar a la base de datos
        $sql = 'SELECT id FROM localidad WHERE nombre_localidad = :nombreLocalidad';
        $stmt = $this->conexion->prepare($sql); // Preparamos la consulta
        $stmt->execute([':nombreLocalidad' => $nombreLocalidad]); // Ejecutamos la consulta con el parámetro

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC); // Obtenemos el resultado como un array asociativo

        if ($resultado) {
            return ['success' => true, 'id' => $resultado['id']]; // Retornamos el ID de la localidad si existe
        } else {
            return ['success' => false, 'message' => 'La localidad no existe'];
        }
    }
}

?>