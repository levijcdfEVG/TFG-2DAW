<?php
class mUsuario {

    private $conexion;

    public function conectar() {
        $objetoBD = new bbdd();
        $this->conexion = $objetoBD->conexion;
    }

    public function getUsersByParams($params) {
        $this->conectar();

        $conditions = [];
        $values = [];

        if (!empty($params['nombre_user'])) {
            $conditions[] = "nombre_user LIKE ?";
            $values[] = "%{$params['nombre_user']}%";
        }

        if (!empty($params['apellidos_user'])) {
            $conditions[] = "apellidos_user LIKE ?";
            $values[] = "%{$params['apellidos_user']}%";
        }

        if (!empty($params['email_user'])) {
            $conditions[] = "email_user LIKE ?";
            $values[] = "%{$params['email_user']}%";
        }

        if (!empty($params['telefono_user'])) {
            $conditions[] = "telefono_user LIKE ?";
            $values[] = "%{$params['telefono_user']}%";
        }

        if ($params['id_rol'] !== 'all') {
            $conditions[] = "id_rol = ?";
            $values[] = $params['id_rol'];
        }

        if ($params['nuevo_educador'] != 0) {
            $conditions[] = "nuevo_educador = ?";
            $values[] = $params['nuevo_educador'];
        }

        if ($params['estado'] != 0) {
            $conditions[] = "estado = ?";
            $values[] = $params['estado'];
        }

        $sql = 'SELECT * FROM usuario';
        if (!empty($conditions)) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $stmt = $this->conexion->prepare($sql);
        $stmt->execute($values);

        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($resultados)) {
            return ['success' => false, 'message' => 'No se encontraron registros en la tabla.'];
        } else {
            return ['success' => true, 'data' => $resultados];
        }
    }
}