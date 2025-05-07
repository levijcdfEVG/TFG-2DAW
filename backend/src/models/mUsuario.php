<?php 
class mUsuario {

    private $conexion;

    public function conectar(){
        $objetoBD = new bbdd(); //Conectamos a la base de datos. Creamos objeto $objetoBD
        $this->conexion = $objetoBD->conexion; //Llamamos al metodo que realiza la conexion a la BBDD
    }

    public function getUsuarioPorId($id) {
        $this->conectar(); //Llamo al metodo conectar de arriba
        
        $sql = "SELECT * FROM usuario WHERE id = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindValue(1, $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUsuarioPorCorreo($correo) {
        $this->conectar(); //Llamo al metodo conectar de arriba
        
        $sql = "SELECT * FROM usuario WHERE correo_user = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindValue(1, $correo, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function insertarUsuario($nombre, $apellido, $correo) {
        $rol = 1; // o el ID del rol por defecto
        $telefono = "000000000"; // valor placeholder obligatorio
        $sql = "INSERT INTO usuario (nombre_user, apellido_user, correo_user, telefono_user, id_rol) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindValue(1, $nombre, PDO::PARAM_STR);
        $stmt->bindValue(2, $apellido, PDO::PARAM_STR);
        $stmt->bindValue(3, $correo, PDO::PARAM_STR);
        $stmt->bindValue(4, $telefono, PDO::PARAM_STR);
        $stmt->bindValue(5, $rol, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
