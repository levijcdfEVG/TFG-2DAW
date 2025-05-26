<?php

class MProvincia {
    private $conexion;

    public function conectar() {
        $objetoBD = new bbdd();
        $this->conexion = $objetoBD->conexion;
    }

    public function getAllProvinces(): array {
        try {
            $this->conectar();

            $sql = "SELECT * FROM provincia ORDER BY nombre";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $result];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al obtener las provincias: ' . $e->getMessage()];
        }
    }

    public function getProvinceById($id) {
        try {
            $query = "SELECT * FROM provincia WHERE id = :id";
            $stmt = $this->conexion->getConexion()->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener la provincia: " . $e->getMessage());
        }
    }
} 