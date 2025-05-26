<?php

    class MUsuario {
        private $conexion;

        public function conectar() {
            $objetoBD = new bbdd();
            $this->conexion = $objetoBD->conexion;
        }

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

                // Prepara y ejecuta la consulta
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
                return ['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $e->getMessage()];
            }
        }

        public function getUserById($id): array {
            $this->conectar();
            $stmt = $this->conexion->prepare("SELECT u.*, r.nombre_rol FROM usuario u LEFT JOIN roles r ON u.id_rol = r.id WHERE u.id = :id");
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return ['success' => true, 'data' => $user];
            } else {
                return ['success' => false, 'message' => 'Usuario no encontrado'];
            }
        }

        public function createUser($data): array {
            $this->conectar();

            $sql = "INSERT INTO usuario (nombre_user, apellido_user, correo_user, telefono_user, id_rol, nuevo_educador, estado)
                    VALUES (:nombre_user, :apellido_user, :correo_user, :telefono_user, :id_rol, :nuevo_educador, :estado)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':nombre_user' => $data['nombre_user'],
                ':apellido_user' => $data['apellido_user'],
                ':correo_user' => $data['correo_user'],
                ':telefono_user' => $data['telefono_user'],
                ':id_rol' => $data['id_rol'],
                ':nuevo_educador' => $data['nuevo_educador'] ?? 0,
                ':estado' => $data['estado']
            ]);

            return ['success' => true, 'message' => 'Usuario creado exitosamente'];
        }

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

        public function deleteUser($id): array {
            $this->conectar();
            $stmt = $this->conexion->prepare("DELETE FROM usuario WHERE id = :id");
            $stmt->execute([':id' => $id]);

            return ['success' => true, 'message' => 'Usuario eliminado correctamente'];
        }

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

    }
