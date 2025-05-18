<?php
    require_once MODELS.'mUsuario.php';

class cUsuario {

    public function __construct() {
        $this->objUsuario = new mUsuario();
    }

    public function getUsersByParams() {
        $params = array( // Recoge los parametros directamente de $_GET
            'nombre_user' => isset($_GET['nombre_user']) ? $_GET['nombre_user'] : '',
            'apellido_user' => isset($_GET['apellido_user']) ? $_GET['apellido_user'] : '',
            'email_user' => isset($_GET['email_user']) ? $_GET['email_user'] : '',
            'telefono_user' => isset($_GET['telefono_user']) ? $_GET['telefono_user'] : '',
            'id_rol' => isset($_GET['id_rol']) ? $_GET['id_rol'] : 'all',
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