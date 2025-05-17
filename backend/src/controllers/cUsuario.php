<?php
    require_once MODELS.'mUsuario.php';

class cUsuario {

    public function __construct() {
        $this->objUsuario = new mUsuario();
    }

    public function getUsersByParams() {

        $params = array( // Recoge los parametros y los mapea con una clave
            'nombre' => isset($_GET['params']['nombre']) ? $_GET['params']['nombre'] : '',
            'apellidos' => isset($_GET['params']['apellidos']) ? $_GET['params']['apellidos'] : '',
            'email' => isset($_GET['params']['email']) ? $_GET['params']['email'] : '',
            'telefono' => isset($_GET['params']['telefono']) ? $_GET['params']['telefono'] : '',
            'rol' => isset($_GET['params']['rol']) ? $_GET['params']['rol'] : 'all',
            'nuevo_educador' => isset($_GET['params']['nuevo_educador']) ? $_GET['params']['nuevo_educador'] : 0,
            'estado' => isset($_GET['params']['estado']) ? $_GET['params']['estado'] : 0
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