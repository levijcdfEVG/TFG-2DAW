<?php 
require_once MODELS.'mUsuario.php';

class cUsuario {
    public function loginGoogle():array {
        $data = json_decode(file_get_contents("php://input"), true);
        $modelo = new mUsuario();

        $usuario = $modelo->getUsuarioPorCorreo($data["correo"]);

        if (!$usuario) {
            // Insertar nuevo usuario
            $modelo->insertarUsuario($data["nombre"], $data["apellido"], $data["correo"]);
            $usuario = $modelo->getUsuarioPorCorreo($data["correo"]);
        }

        return ["success" => true, "usuario" => $usuario];
    }
}
