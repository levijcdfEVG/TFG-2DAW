<?php
    require_once MODELS.'mUsuario.php';

class cUsuario {

    public function __construct() {
        $this->objUsuario = new mUsuario();
    }

    public function getUsersByParams() {
        $params = array( // Recoge los parametros directamente de $_GET
            'nombre' => isset($_GET['nombre']) ? $_GET['nombre'] : '',
            'apellidos' => isset($_GET['apellidos']) ? $_GET['apellidos'] : '',
            'email' => isset($_GET['email']) ? $_GET['email'] : '',
            'telefono' => isset($_GET['telefono']) ? $_GET['telefono'] : '',
            'rol' => isset($_GET['rol']) ? $_GET['rol'] : 'all',
            'nuevo_educador' => isset($_GET['nuevo_educador']) ? $_GET['nuevo_educador'] : 0,
            'estado' => isset($_GET['estado']) ? $_GET['estado'] : 0
        );

        $resultado = $this->objUsuario->getUsersByParams($params);

        // Devolver los datos en formato JSON
        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }

    public function newUser() {}
    public function deleteUser() {}
    public function modifyUser() {}
}
?>