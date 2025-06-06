<?php

class MLocalidad {
    private $conexion;

    public function conectar() {
        $objetoBD = new bbdd();
        $this->conexion = $objetoBD->conexion;
    }

    public function getAllLocalities(): array {
        try {
            $this->conectar();

            $sql = "SELECT l.*, p.nombre as provincia_nombre
                     FROM localidad l
                     LEFT JOIN provincia p ON l.provincia_id = p.id
                     ORDER BY l.nombre_localidad";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $result];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error al obtener las localidades: ' . $e->getMessage()];
        }
    }

    public function getLocalityByProvince($provinceId) {
        try {
            $query = "SELECT * FROM localidad WHERE provincia_id = :province_id ORDER BY nombre_localidad";
            $stmt = $this->conexion->getConexion()->prepare($query);
            $stmt->bindParam(':province_id', $provinceId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener las localidades: " . $e->getMessage());
        }
    }

    public function getLocalityById($id) {
        try {
            $query = "SELECT l.*, p.nombre as provincia_nombre
                     FROM localidad l
                     JOIN provincia p ON l.provincia_id = p.id
                     WHERE l.id = :id";
            $stmt = $this->conexion->getConexion()->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener la localidad: " . $e->getMessage());
        }
    }
}