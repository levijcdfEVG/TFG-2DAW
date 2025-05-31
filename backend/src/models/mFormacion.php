<?php 
/**
 * Clase que maneja las operaciones relacionadas con las formaciones.
 * Incluye funciones para insertar, editar, eliminar y obtener formaciones.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */
class MFormacion {
    private $conexion;

    /**
     * Conecta a la base de datos.
     * @return void
     */
    public function conectar():void {
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }

    /**
     * Lista todas las formaciones activas.
     *
     * @return array Un array asociativo con los datos de las formaciones activas.
     * @throws Exception Si ocurre un error al realizar la consulta.
     */
    public function listarAllFormaciones(): array {
        try {
            $this->conectar();

            // 1. Traer todas las formaciones activas
            $sql = "SELECT * FROM formacion WHERE activo = 1;";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $formaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($formaciones)) {
                return ['success' => false, 'message' => 'No se encontraron registros.'];
            }

            // Extraer IDs de formaciones para consultas posteriores
            $formacionIds = array_column($formaciones, 'id');
            $placeholders = implode(',', array_fill(0, count($formacionIds), '?'));

            // 2. Traer módulos de esas formaciones
            $sql = "SELECT id_formacion, nombre_modulo FROM modulo WHERE id_formacion IN ($placeholders)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($formacionIds);
            $modulosRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Agrupar módulos por id_formacion
            $modulosPorFormacion = [];
            foreach ($modulosRaw as $mod) {
                $modulosPorFormacion[$mod['id_formacion']][] = $mod['nombre_modulo'];
            }

            // 3. Traer objetivos asociados
            $sql = "SELECT ofm.id_formacion, o.descripcion
                    FROM objetivo_formacion ofm
                    JOIN objetivo o ON ofm.id_objetivo = o.id
                    WHERE ofm.id_formacion IN ($placeholders)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($formacionIds);
            $objetivosRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $objetivosPorFormacion = [];
            foreach ($objetivosRaw as $obj) {
                $objetivosPorFormacion[$obj['id_formacion']][] = $obj['descripcion'];
            }

            // 4. Traer cursos asociados
            $sql = "SELECT fc.id_formacion, ca.nombre_curso
                    FROM formacion_curso fc
                    JOIN curso_academico ca ON fc.id_curso = ca.id
                    WHERE fc.id_formacion IN ($placeholders)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($formacionIds);
            $cursosRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $cursosPorFormacion = [];
            foreach ($cursosRaw as $curso) {
                $cursosPorFormacion[$curso['id_formacion']][] = $curso['nombre_curso'];
            }

            //5. Traer el centro
            $sql = "SELECT cf.id_formacion, c.id, c.nombre_centro
                    FROM centro_formacion cf
                    JOIN centro_fundacion c ON cf.id_centro = c.id
                    WHERE cf.id_formacion IN ($placeholders)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($formacionIds);
            $centrosRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Agrupar por id_formacion
            $centrosPorFormacion = [];
            foreach ($centrosRaw as $centro) {
                $idFormacion = $centro['id_formacion'];
                $centrosPorFormacion[$idFormacion] = [
                    'id' => $centro['id'],
                    'nombre' => $centro['nombre_centro']
                ];
            }

            // 6. Montar resultado final agregando modulos, objetivos y cursos a cada formación
            foreach ($formaciones as &$formacion) {
                $id = $formacion['id'];
                $formacion['modulos'] = $modulosPorFormacion[$id] ?? [];
                $formacion['objetivos'] = $objetivosPorFormacion[$id] ?? [];
                $formacion['cursos'] = $cursosPorFormacion[$id] ?? [];
                $formacion['centro'] = $centrosPorFormacion[$id] ?? null;
            }

            return [
                'success' => true,
                'message' => 'Formaciones obtenidas correctamente',
                'data' => $formaciones
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $e->getMessage()];
        }
    }



    /**
     * Desactiva la formación por su id en la base de datos.
     *
     * @param int $id Identificador único de la formación a desactivar.
     * @return array Un array asociativo con la siguiente estructura:
     *               - success: booleano que indica si la operación se realizó correctamente.
     *               - message: string opcional que contiene un mensaje adicional en caso de error.
     */
    public function desactivarFormacionPorId(int $id): array {
        try {
            $this->conectar();

            $sql = "UPDATE formacion SET activo = 0 WHERE id = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    return ['success' => true, 'message' => 'Se ha desactivado la formacion de id '.$id];
                } else {
                    return ['success' => false, 'message' => 'No se ha podido desactivar la formacion de id '.$id];
                }
            } else {
                return ['success' => false, 'message' => 'Error desconocido de desactivacion'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error:' . $e->getMessage()];
        }
    }

    /**
     * Borra la formación por su id en la base de datos.
     *
     * @param int $id Identificador único de la formación a borrar.
     * @return array Un array asociativo con la siguiente estructura:
     *               - success: booleano que indica si la operación se realizó correctamente.
     *               - message: string opcional que contiene un mensaje adicional en caso de error.
     */
    public function borrarFormacionPorId(int $id): array {
        try {
            $this->conectar();

            $sql = "DELETE FROM formacion WHERE id = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    return ['success' => true, 'message' => 'Formación eliminada permanentemente.'];
                } else {
                    return ['success' => false, 'message' => 'No se encontró la formación con el ID proporcionado.'];
                }
            } else {
                return ['success' => false, 'message' => 'No se pudo eliminar la formación.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al eliminar la formación: ' . $e->getMessage()];
        }
    }


        /**
         * Inserta una formación en la base de datos.
         *
         * @param array $data Un array asociativo con la siguiente estructura:
         *                     - formacion: array asociativo con los siguientes campos:
         *                       - lugar_imparticion: string que contiene el lugar de impartición de la formación.
         *                       - duracion: string que contiene la duración de la formación en horas.
         *                       - modalidad: string que contiene la modalidad de la formación.
         *                       - justificacion: string que contiene la justificación de la formación.
         *                       - metodologia: string que contiene la metodología de la formación.
         *                       - docentes: string que contiene los docentes de la formación.
         *                       - dirigido_a: string que contiene el público al que se dirige la formación.
         *                       - activo: booleano que indica si la formación está activa o no.
         *                     - objetivos: array de strings que contiene los objetivos de la formación.
         *
         * @return array Un array asociativo con la siguiente estructura:
         *               - success: booleano que indica si la operación se realizó correctamente.
         *               - message: string opcional que contiene un mensaje adicional en caso de error.
         *               - id: int opcional que contiene el id de la formación insertada, en caso de éxito.
         */
   public function insertarFormacion(array $data): array {
        try {
            $this->conectar();
            $this->conexion->beginTransaction();

            // 1. Insertar formación
            $stmt = $this->conexion->prepare("
                INSERT INTO formacion (lugar_imparticion, duracion, modalidad, justificacion, metodologia, docentes, dirigido_a, activo)
                VALUES (:lugar, :duracion, :modalidad, :justificacion, :metodologia, :docentes, :dirigido_a, :activo)
            ");
            $stmt->execute([
                ':lugar' => $data['formacion']['lugar_imparticion'],
                ':duracion' => $data['formacion']['duracion'],
                ':modalidad' => $data['formacion']['modalidad'],
                ':justificacion' => $data['formacion']['justificacion'],
                ':metodologia' => $data['formacion']['metodologia'],
                ':docentes' => $data['formacion']['docentes'],
                ':dirigido_a' => $data['formacion']['dirigido_a'],
                ':activo' => $data['formacion']['activo'] ?? 1
            ]);
            $idFormacion = $this->conexion->lastInsertId();

            // 2. Insertar módulos
            foreach ($data['modulos'] as $modulo) {
                $stmt = $this->conexion->prepare("
                    INSERT INTO modulo (nombre_modulo, id_formacion)
                    VALUES (:nombre, :id_formacion)
                ");
                $stmt->execute([
                    ':nombre' => $modulo['nombre_modulo'],
                    ':id_formacion' => $idFormacion
                ]);
            }

            // 3. Insertar objetivos (si no existen ya) y vincular
            foreach ($data['objetivos'] as $objetivo) {
                $descripcion = $objetivo['descripcion'];

                // Buscar si ya existe
                $stmt = $this->conexion->prepare("SELECT id FROM objetivo WHERE descripcion = :desc LIMIT 1");
                $stmt->execute([':desc' => $descripcion]);
                $idObjetivo = $stmt->fetchColumn();

                // Si no existe, lo insertamos
                if (!$idObjetivo) {
                    $stmt = $this->conexion->prepare("INSERT INTO objetivo (descripcion) VALUES (:desc)");
                    $stmt->execute([':desc' => $descripcion]);
                    $idObjetivo = $this->conexion->lastInsertId();
                }

                // Insertar relación con formación
                $stmt = $this->conexion->prepare("
                    INSERT INTO objetivo_formacion (id_formacion, id_objetivo)
                    VALUES (:id_formacion, :id_objetivo)
                ");
                $stmt->execute([
                    ':id_formacion' => $idFormacion,
                    ':id_objetivo' => $idObjetivo
                ]);
            }

            // 4. Insertar asociación con centro si se ha proporcionado
            if (!is_null($data['centros'])) {
                $stmt = $this->conexion->prepare("
                    INSERT INTO centro_formacion (id_centro, id_formacion)
                    VALUES (:id_centro, :id_formacion)
                ");
                $stmt->execute([
                    ':id_centro' => $data['centros'],
                    ':id_formacion' => $idFormacion
                ]);
            }

            // 5. Insertar cursos académicos de inicio y fin
            foreach ($data['cursos'] as $cursoArray) {
                $nombreCurso = trim($cursoArray[0]);
                if ($nombreCurso === '') continue;

                $stmt = $this->conexion->prepare("SELECT id FROM curso_academico WHERE nombre_curso = :nombre LIMIT 1");
                $stmt->execute([':nombre' => $nombreCurso]);
                $idCurso = $stmt->fetchColumn();

                if (!$idCurso) {
                    $stmt = $this->conexion->prepare("
                        INSERT INTO curso_academico (nombre_curso)
                        VALUES (:nombre)
                    ");
                    $stmt->execute([':nombre' => $nombreCurso]);
                    $idCurso = $this->conexion->lastInsertId();
                }

                $stmt = $this->conexion->prepare("
                    INSERT INTO formacion_curso (id_curso, id_formacion)
                    VALUES (:id_curso, :id_formacion)
                ");
                $stmt->execute([
                    ':id_curso' => $idCurso,
                    ':id_formacion' => $idFormacion
                ]);
            }

            $this->conexion->commit();
            return ['success' => true];

        } catch (PDOException $e) {
            $this->conexion->rollBack();
            return ['success' => false,$e->getMessage()];
        }
    }

            /**
             * Inserta una formación en la base de datos.
             *
             * @param array $data Un array asociativo con la siguiente estructura:
             *                     - formacion: array asociativo con los siguientes campos:
             *                       - lugar_imparticion: string que contiene el lugar de impartición de la formación.
             *                       - duracion: string que contiene la duración de la formación en horas.
             *                       - modalidad: string que contiene la modalidad de la formación.
             *                       - justificacion: string que contiene la justificación de la formación.
             *                       - metodologia: string que contiene la metodología de la formación.
             *                       - docentes: string que contiene los docentes de la formación.
             *                       - dirigido_a: string que contiene el público al que se dirige la formación.
             *                       - activo: booleano que indica si la formación está activa o no.
             *                     - objetivos: array de strings que contiene los objetivos de la formación.
             *                     - modulos: array de strings que contiene los módulos de la formación.
             *                     - cursos: array de strings que contiene los cursos académicos de inicio y fin de la formación.
             *                     - centros: int opcional que contiene el id del centro educativo al que se asocia la formación, en caso de proporcionarse.
             *
             * @return array Un array asociativo con la siguiente estructura:
             *               - success: booleano que indica si la operación se realizó correctamente.
             *               - message: string opcional que contiene un mensaje adicional en caso de error.
             *               - id: int opcional que contiene el id de la formación insertada, en caso de éxito.
             */
    public function updateFormacion(int $idFormacion, array $data): array {
        try {
            $this->conectar();
            $this->conexion->beginTransaction();

            // 1. Actualizar tabla formacion
            $formacion = $data['formacion'];
            $sql = "UPDATE formacion SET 
                        lugar_imparticion = :lugar,
                        duracion = :duracion,
                        modalidad = :modalidad,
                        justificacion = :justificacion,
                        metodologia = :metodologia,
                        docentes = :docentes,
                        dirigido_a = :dirigido_a,
                        activo = :activo
                    WHERE id = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute([
                ':lugar' => $formacion['lugar_imparticion'],
                ':duracion' => $formacion['duracion'],
                ':modalidad' => $formacion['modalidad'],
                ':justificacion' => $formacion['justificacion'],
                ':metodologia' => $formacion['metodologia'],
                ':docentes' => $formacion['docentes'],
                ':dirigido_a' => $formacion['dirigido_a'],
                ':activo' => $formacion['activo'],
                ':id' => $idFormacion
            ]);

            // 2. Limpiar y volver a insertar módulos
            $this->conexion->prepare("DELETE FROM modulo WHERE id_formacion = :id")->execute([':id' => $idFormacion]);
            foreach ($data['modulos'] as $modulo) {
                $stmt = $this->conexion->prepare("INSERT INTO modulo (nombre_modulo, id_formacion) VALUES (:nombre, :id_formacion)");
                $stmt->execute([
                    ':nombre' => $modulo['nombre_modulo'],
                    ':id_formacion' => $idFormacion
                ]);
            }

            // 3. Limpiar y volver a insertar objetivos
            $this->conexion->prepare("DELETE FROM objetivo_formacion WHERE id_formacion = :id")->execute([':id' => $idFormacion]);
            foreach ($data['objetivos'] as $objetivo) {
                $stmt = $this->conexion->prepare("SELECT id FROM objetivo WHERE descripcion = :desc");
                $stmt->execute([':desc' => $objetivo['descripcion']]);
                $idObjetivo = $stmt->fetchColumn();

                if (!$idObjetivo) {
                    $stmt = $this->conexion->prepare("INSERT INTO objetivo (descripcion) VALUES (:desc)");
                    $stmt->execute([':desc' => $objetivo['descripcion']]);
                    $idObjetivo = $this->conexion->lastInsertId();
                }

                $stmt = $this->conexion->prepare("INSERT INTO objetivo_formacion (id_formacion, id_objetivo) VALUES (:idf, :ido)");
                $stmt->execute([
                    ':idf' => $idFormacion,
                    ':ido' => $idObjetivo
                ]);
            }

            // 4. Limpiar y volver a insertar centro (solo uno, si hay)
            $this->conexion->prepare("DELETE FROM centro_formacion WHERE id_formacion = :id")->execute([':id' => $idFormacion]);
            if (!is_null($data['centros'])) {
                $stmt = $this->conexion->prepare("INSERT INTO centro_formacion (id_centro, id_formacion) VALUES (:idc, :idf)");
                $stmt->execute([
                    ':idc' => $data['centros'],
                    ':idf' => $idFormacion
                ]);
            }

            // 5. Limpiar y volver a insertar cursos académicos
            $this->conexion->prepare("DELETE FROM formacion_curso WHERE id_formacion = :id")->execute([':id' => $idFormacion]);
            foreach ($data['cursos'] as $cursoArray) {
                $nombreCurso = trim($cursoArray[0]);
                if ($nombreCurso === '') continue;

                $stmt = $this->conexion->prepare("SELECT id FROM curso_academico WHERE nombre_curso = :nombre");
                $stmt->execute([':nombre' => $nombreCurso]);
                $idCurso = $stmt->fetchColumn();

                if (!$idCurso) {
                    $stmt = $this->conexion->prepare("INSERT INTO curso_academico (nombre_curso) VALUES (:nombre)");
                    $stmt->execute([':nombre' => $nombreCurso]);
                    $idCurso = $this->conexion->lastInsertId();
                }

                $stmt = $this->conexion->prepare("INSERT INTO formacion_curso (id_curso, id_formacion) VALUES (:idc, :idf)");
                $stmt->execute([
                    ':idc' => $idCurso,
                    ':idf' => $idFormacion
                ]);
            }

            $this->conexion->commit();
            return ['success' => true, 'message' => 'Formacion Actualizada con Exito'];

        } catch (PDOException $e) {
            $this->conexion->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    
    /**
     * Asigna uno o varios usuarios a una formación específica.
     *
     * Inserta registros en la tabla 'inscripciones' para cada usuario proporcionado,
     * evitando duplicados mediante 'INSERT IGNORE'. Utiliza una transacción para asegurar
     * la integridad de los datos.
     *
     * @param int   $idFormacion   El ID de la formación a la que se asignarán los usuarios.
     * @param array $idsUsuarios   Array de IDs de usuarios que serán asignados a la formación.
     *
     * @return array Devuelve un array asociativo con la clave 'success' (bool) indicando si la operación fue exitosa,
     *               y 'message' (string) con un mensaje descriptivo o de error.
     */
    public function asignarUsuarioAFormacion(int $idFormacion, array $idsUsuarios):array{
        try {
            $this->conectar();
            $this->conexion->beginTransaction();



            // Insertar nuevas inscripciones
            $stmtInsert = $this->conexion->prepare(
                "INSERT IGNORE INTO inscripciones (id_formacion, id_usu) VALUES (?, ?)"
            );

            foreach ($idsUsuarios as $idUsuario) {
                $stmtInsert->execute([$idFormacion, $idUsuario]);
            }

            $this->conexion->commit();
            return ['success' => true, 'message' => 'Usuarios asignados correctamente a la formación.'];
        } catch (PDOException $e) {
             $this->conexion->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtiene los usuarios inscritos en una formación específica.
     *
     * @param int $idFormacion El ID de la formación para la que se desean obtener los usuarios.
     * @return array Un array asociativo con la clave 'success' (bool) y, si es exitoso, la clave 'usuarios' (array de usuarios).
     *               En caso de error, incluye la clave 'message' con la descripción del error.
     */
    public function getUsuariosPorFormacion (int $idFormacion) : array{
        try {
            $this->conectar();
            $stmt = $this->conexion->prepare("
                SELECT u.id, u.nombre_user, u.apellido_user, u.correo_user, u.telefono_user, u.id_rol, u.id_centro
                FROM usuario u
                INNER JOIN inscripciones i ON u.id = i.id_usu
                WHERE i.id_formacion = ?
            ");
            $stmt->execute([$idFormacion]);
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'usuarios' => $usuarios];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al obtener usuarios: ' . $e->getMessage()];
        }
    }

    /**
     * Desasigna una lista de usuarios de una formación específica.
     *
     * Elimina los registros de la tabla 'inscripciones' que correspondan a la formación y a los usuarios indicados.
     * Utiliza una transacción para asegurar la integridad de los datos.
     *
     * @param int   $idFormacion  ID de la formación de la que se desasignarán los usuarios.
     * @param array $idsUsuarios  Array de IDs de usuarios a desasignar de la formación.
     *
     * @return array Devuelve un array asociativo con la clave 'success' (bool) y 'message' (string) indicando el resultado de la operación.
     */
    public function desasignarUsuariosFormacion(int $idFormacion, array $idsUsuarios):array{
        try {
            $this->conectar();
            $this->conexion->beginTransaction();

            $stmt = $this->conexion->prepare("
                DELETE FROM inscripciones 
                WHERE id_formacion = ? AND id_usu = ?
            ");

            foreach ($idsUsuarios as $idUsuario) {
                $stmt->execute([$idFormacion, $idUsuario]);
            }

            $this->conexion->commit();
            return ['success' => true, 'message' => 'Usuarios desasignados correctamente.'];
        } catch (PDOException $e) {
            $this->conexion->rollBack();
            return ['success' => false, 'message' => 'Error al desasignar usuarios: ' . $e->getMessage()];
        }
    }

}