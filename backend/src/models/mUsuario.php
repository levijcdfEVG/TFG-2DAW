<?php
    /**
     * Clase mUsuario
     *
     * Esta clase maneja las operaciones relacionadas con los usuarios en la base de datos.
     * Incluye funciones para autenticación, búsqueda, creación, modificación y eliminación
     * de usuarios del sistema.
     */
    class mUsuario {

        /**
         * Variable privada para la conexión a la base de datos.
         *
         * @var PDO
         */
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
         * Obtiene un usuario por su correo electronico
         *
         * @param string $correo Correo electronico del usuario
         * @return array|null Retorna un array con los datos del usuario si existe, null en caso contrario
         * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
         */
        public function getUsuarioPorCorreo($correo) {
            $this->conectar(); // Conexión a la base de datos

            // Paso 1: Buscar usuario por correo
            $sql = "SELECT * FROM usuario WHERE correo_user = ?";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(1, $correo, PDO::PARAM_STR);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Paso 2: Si se encontró el usuario, actualizar fch_registro
            if ($usuario) {
                $sql = "UPDATE usuario SET fch_registro = NOW() WHERE correo_user = ?";
                $stmt = $this->conexion->prepare($sql);
                $stmt->bindValue(1, $correo, PDO::PARAM_STR);
                $stmt->execute();

                // Paso 3: Volver a obtener el usuario actualizado
                $sql = "SELECT * FROM usuario WHERE correo_user = ?";
                $stmt = $this->conexion->prepare($sql);
                $stmt->bindValue(1, $correo, PDO::PARAM_STR);
                $stmt->execute();

                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return $usuario; // Puede ser null si no existe
        }

        /**
         * Obtiene usuarios filtrados por diferentes parámetros.
         *
         * Este método permite buscar usuarios aplicando múltiples filtros como nombre,
         * apellido, correo, teléfono, rol y estado. Los resultados se ordenan por nombre.
         *
         * @param array $params Array asociativo con los parámetros de búsqueda.
         * @return array Resultado de la búsqueda con los usuarios encontrados.
         */
        public function getUsersByParams($params): array {
            try {
                $this->conectar();

                // Usa los parametros para crear la consulta
                $sql = "SELECT u.*, r.nombre_rol
                        FROM usuario u
                        LEFT JOIN roles r ON u.id_rol = r.id
                        WHERE 1=1";

                $conditions = [];
                $values = [];

                if (!empty($params['nombre_user'])) {
                    $conditions[] = "u.nombre_user LIKE :nombre_user";
                    $values[':nombre_user'] = "%" . $params['nombre_user'] . "%";
                }

                if (!empty($params['apellido_user'])) {
                    $conditions[] = "u.apellido_user LIKE :apellido_user";
                    $values[':apellido_user'] = "%" . $params['apellido_user'] . "%";
                }

                if (!empty($params['correo_user'])) {
                    $conditions[] = "u.correo_user LIKE :correo_user";
                    $values[':correo_user'] = "%" . $params['correo_user'] . "%";
                }

                if (!empty($params['telefono_user'])) {
                    $conditions[] = "u.telefono_user LIKE :telefono_user";
                    $values[':telefono_user'] = "%" . $params['telefono_user'] . "%";
                }

                if (isset($params['id_rol']) && $params['id_rol'] !== '0' && $params['id_rol'] !== 0) {
                    $conditions[] = "u.id_rol = :id_rol";
                    $values[':id_rol'] = $params['id_rol'];
                }

                if (isset($params['nuevo_educador']) && $params['nuevo_educador'] !== '2' && $params['nuevo_educador'] !== 2) {
                    $conditions[] = "u.nuevo_educador = :nuevo_educador";
                    $values[':nuevo_educador'] = $params['nuevo_educador'];
                }

                if (isset($params['estado']) && $params['estado'] !== '2' && $params['estado'] !== 2) {
                    $conditions[] = "u.estado = :estado";
                    $values[':estado'] = $params['estado'];
                }

                if (!empty($conditions)) {
                    $sql .= " AND " . implode(" AND ", $conditions);
                }

                $sql .= " ORDER BY u.nombre_user ASC";

                // Prepara y ejecuta la consulta
                $stmt = $this->conexion->prepare($sql);
                $stmt->execute($values);
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                return ['success' => true, 'message' => count($results) . ' usuario(s) encontrado(s)','data' => $results];
            } catch (PDOException $e) {
                error_log('Database Error: ' . $e->getMessage());
                return ['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $e->getMessage()];
            }
        }

        public function getUsersByCentro($params): array {
            try {
                $this->conectar();

                $sql = "SELECT u.*, r.nombre_rol
                        FROM usuario u
                        LEFT JOIN roles r ON u.id_rol = r.id
                        WHERE u.id_centro = :id_centro";

                $values = [':id_centro' => $params['id_centro']];

                $conditions = [];


                if (!empty($params['nombre_user'])) {
                    $conditions[] = "u.nombre_user LIKE :nombre_user";
                    $values[':nombre_user'] = "%" . $params['nombre_user'] . "%";
                }

                if (!empty($params['apellido_user'])) {
                    $conditions[] = "u.apellido_user LIKE :apellido_user";
                    $values[':apellido_user'] = "%" . $params['apellido_user'] . "%";
                }

                if (!empty($params['correo_user'])) {
                    $conditions[] = "u.correo_user LIKE :correo_user";
                    $values[':correo_user'] = "%" . $params['correo_user'] . "%";
                }

                if (!empty($params['telefono_user'])) {
                    $conditions[] = "u.telefono_user LIKE :telefono_user";
                    $values[':telefono_user'] = "%" . $params['telefono_user'] . "%";
                }

                if (isset($params['id_rol']) && $params['id_rol'] !== '0' && $params['id_rol'] !== 0) {
                    $conditions[] = "u.id_rol = :id_rol";
                    $values[':id_rol'] = $params['id_rol'];
                }

                if (isset($params['nuevo_educador']) && $params['nuevo_educador'] !== '0' && $params['nuevo_educador'] !== 0) {
                    $conditions[] = "u.nuevo_educador = :nuevo_educador";
                    $values[':nuevo_educador'] = $params['nuevo_educador'];
                }

                if (isset($params['estado']) && $params['estado'] !== '2' && $params['estado'] !== 2) {
                    $conditions[] = "u.estado = :estado";
                    $values[':estado'] = $params['estado'];
                }

                if (!empty($conditions)) {
                    $sql .= " AND " . implode(" AND ", $conditions);
                }

                $sql .= " ORDER BY u.nombre_user ASC";

                $stmt = $this->conexion->prepare($sql);
                $stmt->execute($values);

                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'success' => true,
                    'message' => count($results) . ' usuario(s) encontrado(s)',
                    'data' => $results
                ];
            } catch (PDOException $e) {
                error_log('Database Error: ' . $e->getMessage());
                return [
                    'success' => false,
                    'message' => 'Error al ejecutar la consulta: ' . $e->getMessage(),
                    'data' => [] // ← Evita errores en el frontend
                ];
            }
}


        /**
         * Obtiene un usuario específico por su ID.
         *
         * Este método busca en la base de datos un usuario por su ID y devuelve
         * toda su información, incluyendo su rol.
         *
         * @param int $id ID del usuario a buscar.
         * @return array Resultado de la búsqueda con los datos del usuario.
         */
        public function getUserById($id): array {
            $this->conectar();

            $sql = "SELECT u.*, r.nombre_rol, cf.nombre_centro, l.nombre_localidad FROM usuario u
                    JOIN roles r ON u.id_rol = r.id
                    JOIN centro_fundacion cf ON u.id_centro = cf.id
                    JOIN localidad l ON cf.id_local = l.id
                    WHERE u.id = :id;";


            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return ['success' => true, 'data' => $user];
            } else {
                return ['success' => false, 'message' => 'Usuario no encontrado'];
            }
        }

        /**
         * Crea un nuevo usuario en el sistema.
         *
         * Este método inserta un nuevo registro de usuario en la base de datos
         * con todos los datos proporcionados.
         *
         * @param array $data Array con los datos del nuevo usuario.
         * @return array Resultado de la operación de creación.
         */
        public function createUser($data): array {
            $this->conectar();

            $sql = "INSERT INTO usuario (nombre_user, apellido_user, correo_user, telefono_user, id_rol, id_centro, nuevo_educador, estado)
                    VALUES (:nombre_user, :apellido_user, :correo_user, :telefono_user, :id_rol, :id_centro, :nuevo_educador, :estado)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':nombre_user' => $data['nombre_user'],
                ':apellido_user' => $data['apellido_user'],
                ':correo_user' => $data['correo_user'],
                ':telefono_user' => $data['telefono_user'],
                ':id_rol' => $data['id_rol'],
                ':id_centro' => $data['id_centro'],
                ':nuevo_educador' => $data['nuevo_educador'] ?? 0,
                ':estado' => $data['estado']
            ]);


            return ['success' => true, 'message' => 'Usuario creado exitosamente'];
        }

        /**
         * Actualiza los datos de un usuario existente.
         *
         * Este método modifica los datos de un usuario en la base de datos
         * basándose en su ID.
         *
         * @param array $data Array con los nuevos datos del usuario.
         * @return array Resultado de la operación de actualización.
         */
        public function updateUser($data): array {
            $this->conectar();

            $sql = "UPDATE usuario SET
                        nombre_user = :nombre_user,
                        apellido_user = :apellido_user,
                        correo_user = :correo_user,
                        telefono_user = :telefono_user,
                        id_rol = :id_rol,
                        nuevo_educador = :nuevo_educador,
                        estado = :estado
                    WHERE id = :id";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':id' => $data['id'],
                ':nombre_user' => $data['nombre_user'],
                ':apellido_user' => $data['apellido_user'],
                ':correo_user' => $data['correo_user'],
                ':telefono_user' => $data['telefono_user'],
                ':id_rol' => $data['id_rol'],
                ':nuevo_educador' => $data['nuevo_educador'] ?? 0,
                ':estado' => $data['estado']
            ]);

            return ['success' => true, 'message' => 'Usuario actualizado correctamente'];
        }

        /**
         * Elimina un usuario del sistema.
         *
         * Este método elimina un usuario de la base de datos basándose en su ID.
         *
         * @param int $id ID del usuario a eliminar.
         * @return array Resultado de la operación de eliminación.
         */
        public function deleteUser($id): array {
            $this->conectar();
            $stmt = $this->conexion->prepare("DELETE FROM usuario WHERE id = :id");
            $stmt->execute([':id' => $id]);

            return ['success' => true, 'message' => 'Usuario eliminado correctamente'];
        }

        /**
         * Cambia el estado de un usuario (activo/inactivo).
         *
         * Este método alterna el estado de un usuario entre activo (1) e inactivo (0)
         * basándose en su ID.
         *
         * @param int $id ID del usuario cuyo estado se desea cambiar.
         * @return array Resultado de la operación de cambio de estado.
         */
        public function changeStatus($id): array {
            $this->conectar();

            $sql = "UPDATE usuario SET estado = CASE
                    WHEN estado = 1 THEN 0
                    WHEN estado = 0 THEN 1
                    ELSE estado
                    END
                    WHERE id = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([':id' => $id]);

            return ['success' => true, 'message' => 'Usuario actualizado exitosamente'];
        }

        /**
         * Obtiene los datos de un usuario por su ID.
         *
         * Este método conecta a la base de datos y recupera el nombre de usuario y el correo electrónico
         * del usuario correspondiente al ID proporcionado.
         *
         * @param int $idUsuario El ID del usuario a buscar.
         * @return array|null Un array asociativo con las claves 'nombre_user' y 'correo_user' si se encuentra el usuario, o null si no existe.
         *
         * @author Levi Josué Candeias de Figueiredo
         */
        public function obtenerUsuarioPorId(int $idUsuario): ?array {
            $this->conectar();
            $stmt = $this->conexion->prepare("SELECT nombre_user, correo_user FROM usuario WHERE id = ?");
            $stmt->execute([$idUsuario]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        }


    }
?>
