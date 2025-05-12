<?php
    require_once MODELS.'mUsuarios.php';

    class cUsuarios {

        public function __construct() {

            $this->objUsuario = new mUsuarios();
        }

        public function listaUsuarios(){
            // Soporta paginación y filtros
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
            $filtros = $_GET;
            unset($filtros['controlador'], $filtros['accion'], $filtros['page'], $filtros['limit']);
            $resultado = $this->objUsuario->listaUsuarios($page, $limit, $filtros);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function validarLocalidad() {
            // Leer los datos enviados desde el frontend
            $inputData = json_decode(file_get_contents('php://input'), true);

            if (isset($inputData['nombre_localidad'], $inputData['cp'])) {
                $nombreLocalidad = $inputData['nombre_localidad'];
                $cp = $inputData['cp'];
                $idProvincia = substr($cp, 0, 2); // Obtener los dos primeros dígitos del CP

                // Llamar al modelo para verificar la localidad
                $resultado = $this->objUsuario->validarLocalidad($nombreLocalidad, $idProvincia);

                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos para validar la localidad']);
                exit;
            }
        }

        public function insertIntoUsuarios(){
            // El frontend envía application/x-www-form-urlencoded
            $nombre = $_POST['nombre'] ?? '';
            $apellidos = $_POST['apellidos'] ?? '';
            $email = $_POST['email'] ?? '';
            $telefono = $_POST['telefono'] ?? '';
            $dni = $_POST['dni'] ?? '';
            // Validaciones frontend
            if (empty($nombre) || empty($apellidos) || empty($email) || empty($telefono) || empty($dni)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                exit;
            }
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $nombre)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El nombre no puede contener números']);
                exit;
            }
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $apellidos)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El apellido no puede contener números']);
                exit;
            }
            if (!preg_match('/^[0-9]{9}$/', $telefono)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El teléfono debe tener exactamente 9 dígitos']);
                exit;
            }
            if (!preg_match('/^[a-zA-Z0-9._%+-]+@fundacionloyola\.net$/', $email)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El correo electrónico debe pertenecer al dominio fundacionloyola.net']);
                exit;
            }
            // TODO: Validar DNI si es necesario
            $resultado = $this->objUsuario->insertIntoUsuarios($nombre, $apellidos, $email, $telefono, $dni);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function modificarUsuario() {
            $inputData = json_decode(file_get_contents('php://input'), true);
            $emailReferencia = $inputData['emailReferencia'] ?? '';
            $datos = $inputData['datosModificados'] ?? [];
            $nombre = $datos['nombre'] ?? '';
            $apellidos = $datos['apellidos'] ?? '';
            $email = $datos['email'] ?? '';
            $telefono = $datos['telefono'] ?? '';
            $dni = $datos['dni'] ?? '';
            if (empty($nombre) || empty($apellidos) || empty($email) || empty($telefono) || empty($dni)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                exit;
            }
            // Validaciones igual que en insert
            $resultado = $this->objUsuario->modificarUsuario($emailReferencia, $nombre, $apellidos, $email, $telefono, $dni);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function eliminarUsuario() {
            $inputData = json_decode(file_get_contents('php://input'), true);
            $emailReferencia = $inputData['emailReferencia'] ?? '';
            $resultado = $this->objUsuario->eliminarUsuario($emailReferencia);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function buscarUsuarios() {
            // Recibe filtros por POST (application/x-www-form-urlencoded)
            $filtros = $_POST;
            $resultado = $this->objUsuario->buscarUsuarios($filtros);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }

        public function validarUsuario() {
            $inputData = json_decode(file_get_contents('php://input'), true);
            $dni = $inputData['dni'] ?? '';
            $email = $inputData['email'] ?? '';
            $resultado = $this->objUsuario->validarUsuario($dni, $email);
            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        }
    }

?>