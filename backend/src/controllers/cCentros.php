<?php
    require_once MODELS.'mCentros.php';

    class cCentros {

        public function __construct() {

            $this->objCentro = new mCentros();
        }

        public function listaCentros(){
            $resultado = $this->objCentro->listaCentros();

            // Devolver los datos en formato JSON
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
                $resultado = $this->objCentro->validarLocalidad($nombreLocalidad, $idProvincia);
        
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos para validar la localidad']);
                exit;
            }
        }

        public function insertIntoCentros(){
            // Depurar los datos recibidos
            error_log('Contenido de $_POST: ' . print_r($_POST, true)); // Para datos enviados como application/x-www-form-urlencoded
            error_log('Contenido de php://input: ' . file_get_contents('php://input')); // Para datos enviados como JSON

        // ---------------------------VALIDACIONES---------------------------      
            // Validar que las claves existen en $_POST
            if (
                isset($_POST['nombre_centro'], $_POST['direccion_centro'], $_POST['cp'], 
                      $_POST['nombre_localidad'], $_POST['telefono_centro'], $_POST['correo_centro'])
            ) {
                $nombreCentro = $_POST['nombre_centro'];
                $direccionCentro = $_POST['direccion_centro'];
                $cpCentro = $_POST['cp'];
                $localidadCentro = $_POST['nombre_localidad'];
                $telefonoCentro = $_POST['telefono_centro'];
                $emailCentro = $_POST['correo_centro'];

            // Validar que ninguno de los campos esté vacío
            if (empty($nombreCentro) || empty($direccionCentro) || empty($cpCentro) || 
            empty($localidadCentro) || empty($telefonoCentro) || empty($emailCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                exit;
            }
            // Validar que el nombre del centro no contenga números
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $nombreCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El nombre del centro no puede contener números']);
                exit;
            }

            // Validar que la localidad no contenga números
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $localidadCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'La localidad no puede contener números']);
                exit;
            }

            //Validar que el codigo postal y el telefono solo contengan números
            if (!preg_match('/^[0-9]+$/', $cpCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El código postal solo puede contener números']);
                exit;
            }
            if (!preg_match('/^[0-9]+$/', $telefonoCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El teléfono solo puede contener números']);
                exit;
            }

            // Validar que el código postal tenga exactamente 5 dígitos
            if (!preg_match('/^[0-9]{5}$/', $cpCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El código postal debe tener exactamente 5 dígitos']);
                exit;
            }

            // Validar que el teléfono tenga exactamente 9 dígitos
            if (!preg_match('/^[0-9]{9}$/', $telefonoCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El teléfono debe tener exactamente 9 dígitos']);
                exit;
            }

            // Validar que el correo electrónico tenga el dominio correcto
            if (!preg_match('/^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/', $emailCentro)) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El correo electrónico debe pertenecer al dominio fundacionloyola.es']);
                exit;
            }

           // Validar que la localidad coincida con el código postal
            $idProvincia = substr($cpCentro, 0, 2); // Obtener los dos primeros dígitos del CP

            // Comprobar si la localidad existe en la base de datos
            $resultadoLocalidad = $this->objCentro->localidadExiste($localidadCentro);

            if (!$resultadoLocalidad['success']) {
                // Si la localidad no existe, salimos de la validación (se creará más adelante)
                error_log('La localidad no existe en la base de datos. Se procederá a crearla más adelante.');
            } else {
                // Si la localidad existe, verificamos que coincida con el código postal
                $resultadoValidacion = $this->objCentro->validarLocalidad($localidadCentro, $idProvincia);

                if (!$resultadoValidacion['success']) {
                    // Si la validación falla, devolvemos un mensaje de error
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'La localidad no se enccuentra en la provincia correspondiente al código postal']);
                    exit;
                }
            }

            //Validar que todos los campos no se repiten en la base de datos
            $resultadoValidacion = $this->objCentro->validarDatosCentro($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro);

            if (!$resultadoValidacion['success']) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Los datos del centro no han cambiado']);
                exit;
            }
            //Validar que el nombre del centro tiene maximo 50 caracteres
            if (strlen($nombreCentro) > 50) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El nombre del centro no puede tener más de 50 caracteres']);
                exit;
            }
            //Validar que la direccion del centro tiene maximo 50 caracteres
            if (strlen($direccionCentro) > 50) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'La dirección del centro no puede tener más de 50 caracteres']);
                exit;
            }
            //Validar que el email del centro tiene maximo 255 caracteres
            if (strlen($emailCentro) > 255) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'El correo electrónico del centro no puede tener más de 255 caracteres']);
                exit;
            }

            // --------------------------- FIN DE VALIDACIONES---------------------------
                $resultado = $this->objCentro->insertIntoCentros($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro);
        
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                // Respuesta de error si faltan datos
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
            }
        }

        public function modificarCentro() {
            // Leer los datos enviados desde el frontend
            $inputData = json_decode(file_get_contents('php://input'), true);
        
            // Validar que las claves necesarias existen
            if (
                isset($inputData['emailReferencia']) &&
                isset($inputData['datosModificados']) &&
                is_array($inputData['datosModificados'])
            ) {
                $emailReferencia = $inputData['emailReferencia'];
                $datosModificados = $inputData['datosModificados'];
        
                // Extraer los datos modificados
                $nombreCentro = $datosModificados['nombre_centro'] ?? null;
                $direccionCentro = $datosModificados['direccion_centro'] ?? null;
                $cpCentro = $datosModificados['cp'] ?? null;
                $localidadCentro = $datosModificados['nombre_localidad'] ?? null;
                $telefonoCentro = $datosModificados['telefono_centro'] ?? null;
                $emailCentro = $datosModificados['correo_centro'] ?? null;
        
                // Llamar al modelo para realizar la modificación
                $resultado = $this->objCentro->modificarCentro(
                    $emailReferencia,
                    $nombreCentro,
                    $direccionCentro,
                    $cpCentro,
                    $localidadCentro,
                    $telefonoCentro,
                    $emailCentro
                );
        
                // Responder con el resultado
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                // Respuesta de error si faltan datos
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
            }
        }

        public function eliminarCentro() {
            // Leer los datos enviados desde el frontend
            $inputData = json_decode(file_get_contents('php://input'), true);
        
            // Validar que las claves necesarias existen
            if (isset($inputData['emailReferencia'])) {
                $emailReferencia = $inputData['emailReferencia'];
        
                // Llamar al modelo para realizar la eliminación
                $resultado = $this->objCentro->eliminarCentro($emailReferencia);
        
                // Responder con el resultado
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                // Respuesta de error si faltan datos
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
            }
        }
    }

?>