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

        if (!empty($params['nombre'])) {
            $conditions[] = "nombre LIKE ?";
            $values[] = "%{$params['nombre']}%";
        }

        if (!empty($params['apellidos'])) {
            $conditions[] = "apellidos LIKE ?";
            $values[] = "%{$params['apellidos']}%";
        }

        if (!empty($params['email'])) {
            $conditions[] = "email LIKE ?";
            $values[] = "%{$params['email']}%";
        }

        if (!empty($params['telefono'])) {
            $conditions[] = "telefono LIKE ?";
            $values[] = "%{$params['telefono']}%";
        }

        if ($params['rol'] !== 'all') {
            $conditions[] = "rol = ?";
            $values[] = $params['rol'];
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