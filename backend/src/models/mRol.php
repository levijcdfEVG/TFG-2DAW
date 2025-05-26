<?php

class MRol {
    private $conexion;

    public function conectar() {
        $objetoBD = new bbdd();
        $this->conexion = $objetoBD->conexion;
    }

    public function getAllRoles(): array {
        try {
            $this->conectar();

            $sql = "SELECT * FROM roles ORDER BY nombre_rol ASC";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $result];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al obtener los roles: ' . $e->getMessage()];
        }
    }
}
