<?php
require_once MODELS . 'mCentros.php';
require_once 'helpers/auth_helper.php';

/**
 * Controlador de centros educativos.
 *
 * Gestiona las solicitudes relacionadas con los centros, incluyendo su listado
 * y la validación de localidades en función del nombre y código postal.
 *
 * @category Controlador
 * @package  TFG-2DAW
 * @author   David Silva Vega <dsilvavega.guadalupe@alumnado.fundacionloyola.net>
 * @license  https://opensource.org/licenses/MIT MIT License
 *     
 */
class cCentros
{
    /**
     * Instancia del modelo mCentros.
     *
     * @var mCentros
     */
    private $objCentro;

    /**
     * Constructor de la clase.
     *
     * Inicializa el modelo mCentros para acceder a la lógica de datos relacionada
     * con los centros educativos.
     */

    public function __construct()
    {
        $this->objCentro = new mCentros();
    }

    /**
     * Obtiene la lista completa de centros.
     *
     * Este método llama al modelo para recuperar todos los centros disponibles
     * y los devuelve en formato JSON.
     *
     * @return void
     */

    public function listaCentros()
    {
        verificarTokenYCorreo();
        $resultado = $this->objCentro->listaCentros();

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }

    /**
     * Valida una localidad en base a su nombre y código postal.
     *
     * Este método recibe un JSON con el nombre de la localidad y el código postal,
     * extrae la provincia a partir del código postal y valida la localidad llamando
     * al modelo. Devuelve el resultado en formato JSON.
     *
     * @return void
     */

    public function validarLocalidad()
    {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (isset($inputData['nombre_localidad'], $inputData['cp'])) {
            $nombreLocalidad = $inputData['nombre_localidad'];
            $cp = $inputData['cp'];
            $idProvincia = substr($cp, 0, 2);

            $resultado = $this->objCentro->validarLocalidad($nombreLocalidad, $idProvincia);

            header('Content-Type: application/json');
            echo json_encode($resultado);
            exit;
        } else {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Faltan datos para validar la localidad'
            ]);
            exit;
        }
    }

     /**
     * Inserta un nuevo centro en la base de datos tras validar los datos recibidos.
     *
     * Este método recibe los datos del nuevo centro mediante `$_POST` (en formato 
     * `application/x-www-form-urlencoded`) o desde el cuerpo de la solicitud (`php://input`).
     * Realiza múltiples validaciones de los datos: existencia, formato, contenido, longitud
     * y dominio del correo. Si todas las validaciones son correctas, se realiza la inserción.
     * En caso contrario, devuelve un mensaje de error en formato JSON.
     *
     * @return void
     */

    public function insertIntoCentros()
    {
        verificarTokenYCorreo();
        // Log para depurar los datos recibidos
        error_log('Contenido de $_POST: ' . print_r($_POST, true));
        error_log('Contenido de php://input: ' . file_get_contents('php://input'));

        // --------------------------- VALIDACIONES ---------------------------
        
        // Verificar que todos los campos requeridos están presentes
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
            if (
                empty($nombreCentro) || empty($direccionCentro) || empty($cpCentro) ||
                empty($localidadCentro) || empty($telefonoCentro) || empty($emailCentro)
            ) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Todos los campos son obligatorios'
                ]);
                exit;
            }

            // Validar que el nombre del centro no contenga números
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $nombreCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El nombre del centro no puede contener números'
                ]);
                exit;
            }

            // Validar que la localidad no contenga números
            if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $localidadCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'La localidad no puede contener números'
                ]);
                exit;
            }

            // Validar que el código postal y el teléfono contengan solo números
            if (!preg_match('/^[0-9]+$/', $cpCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El código postal solo puede contener números'
                ]);
                exit;
            }

            if (!preg_match('/^[0-9]+$/', $telefonoCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El teléfono solo puede contener números'
                ]);
                exit;
            }

            // Validar longitud del código postal
            if (!preg_match('/^[0-9]{5}$/', $cpCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El código postal debe tener exactamente 5 dígitos'
                ]);
                exit;
            }

            // Validar longitud del teléfono
            if (!preg_match('/^[0-9]{9}$/', $telefonoCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El teléfono debe tener exactamente 9 dígitos'
                ]);
                exit;
            }

            // Validar el dominio del correo electrónico
            if (!preg_match('/^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/', $emailCentro)) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El correo electrónico debe pertenecer al dominio fundacionloyola.es'
                ]);
                exit;
            }
        } else {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Faltan campos obligatorios'
            ]);
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
                    echo json_encode([
                        'success' => false,
                        'message' => 'La localidad no se encuentra en la provincia correspondiente al código postal'
                    ]);
                    exit;
                }
            }

            // Validar que todos los datos del centro no se repiten en la base de datos
            $resultadoValidacion = $this->objCentro->validarDatosCentro(
                $nombreCentro, $direccionCentro, $cpCentro, $localidadCentro,
                $telefonoCentro, $emailCentro
            );

            if (!$resultadoValidacion['success']) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Los datos del centro no han cambiado'
                ]);
                exit;
            }

            // Validar longitud máxima del nombre del centro
            if (strlen($nombreCentro) > 50) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El nombre del centro no puede tener más de 50 caracteres'
                ]);
                exit;
            }

            // Validar longitud máxima de la dirección
            if (strlen($direccionCentro) > 50) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'La dirección del centro no puede tener más de 50 caracteres'
                ]);
                exit;
            }

            // Validar longitud máxima del correo electrónico
            if (strlen($emailCentro) > 255) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'El correo electrónico del centro no puede tener más de 255 caracteres'
                ]);
                exit;
            }

            // --------------------------- FIN DE VALIDACIONES ---------------------------

            /**
             * Inserción del nuevo centro en la base de datos tras validaciones.
             *
             * @var array $resultado Resultado del intento de inserción.
             */
            $resultado = $this->objCentro->insertIntoCentros(
                $nombreCentro, $direccionCentro, $cpCentro, $localidadCentro,
                $telefonoCentro, $emailCentro
            );
            if ($resultado['success']) {
                // Responder con el resultado
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            }  else {
            // Respuesta de error si faltan datos
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Faltan datos en la solicitud'
            ]);
            exit;
            }
        }

        /**
         * Modifica los datos de un centro educativo existente.
         *
         * Este método recibe un objeto JSON desde el frontend con los datos nuevos del centro
         * y el correo electrónico de referencia para identificar el registro a modificar.
         * Se realizan validaciones de integridad, formato, longitud y dominio antes de
         * enviar los datos al modelo para su actualización en la base de datos.
         *
         * @return void
         */

        public function modificarCentro() {
            // Leer los datos enviados desde el frontend en formato JSON
            $inputData = json_decode(file_get_contents('php://input'), true);
            

            // ---------------------------VALIDACIONES--------------------------- 
            // Validar que las claves necesarias existen en el JSON recibido
            if (
                isset($inputData['emailReferencia'], $inputData['datosModificados']['nombre_centro'], $inputData['datosModificados']['direccion_centro'], 
                      $inputData['datosModificados']['cp'], $inputData['datosModificados']['nombre_localidad'], 
                      $inputData['datosModificados']['telefono_centro'], $inputData['datosModificados']['correo_centro'])
            ) {
                $emailReferencia = $inputData['emailReferencia'];
                $nombreCentro = $inputData['datosModificados']['nombre_centro'];
                $direccionCentro = $inputData['datosModificados']['direccion_centro'];
                $cpCentro = $inputData['datosModificados']['cp'];
                $localidadCentro = $inputData['datosModificados']['nombre_localidad'];
                $telefonoCentro = $inputData['datosModificados']['telefono_centro'];
                $emailCentro = $inputData['datosModificados']['correo_centro'];
            } else {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
            exit;
            }

                // Validaciones básicas de contenido y formato
                if (empty($nombreCentro) || empty($direccionCentro) || empty($cpCentro) || 
                empty($localidadCentro) || empty($telefonoCentro) || empty($emailCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                    exit;
                }
                
                if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $nombreCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El nombre del centro no puede contener números']);
                    exit;
                }

      
                if (!preg_match('/^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/', $localidadCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'La localidad no puede contener números']);
                    exit;
                }


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

  
                if (!preg_match('/^[0-9]{5}$/', $cpCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El código postal debe tener exactamente 5 dígitos']);
                    exit;
                }


                if (!preg_match('/^[0-9]{9}$/', $telefonoCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El teléfono debe tener exactamente 9 dígitos']);
                    exit;
                }

                if (!preg_match('/^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/', $emailCentro)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El correo electrónico debe pertenecer al dominio fundacionloyola.es']);
                    exit;
                }

                // Validar que la localidad coincida con el código postal
                $idProvincia = substr($cpCentro, 0, 2); // Obtener los dos primeros dígitos del CP

                $resultadoLocalidad = $this->objCentro->localidadExiste($localidadCentro);

                if (!$resultadoLocalidad['success']) {
                    // Localidad no existe, se podría crear más adelante
                    error_log('La localidad no existe en la base de datos. Se procederá a crearla más adelante.');
                } else {
                    // Validar que la localidad existe en la provincia correspondiente
                    $resultadoValidacion = $this->objCentro->validarLocalidad($localidadCentro, $idProvincia);

                    if (!$resultadoValidacion['success']) {
                        // Si la validación falla, devolvemos un mensaje de error
                        header('Content-Type: application/json');
                        echo json_encode(['success' => false, 'message' => 'La localidad no se encuentra en la provincia correspondiente al código postal']);
                        exit;
                    }
                }

                // Validar que no se están enviando los mismos datos (sin modificaciones)
                $resultadoValidacion = $this->objCentro->validarDatosCentro($nombreCentro, $direccionCentro, $cpCentro, $localidadCentro, $telefonoCentro, $emailCentro);

                if (!$resultadoValidacion['success']) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'Los datos del centro no han cambiado']);
                    exit;
                }
                 // Validar longitudes máximas
                if (strlen($nombreCentro) > 50) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El nombre del centro no puede tener más de 50 caracteres']);
                    exit;
                }
                
                if (strlen($direccionCentro) > 50) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'La dirección del centro no puede tener más de 50 caracteres']);
                    exit;
                }
                
                if (strlen($emailCentro) > 255) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'message' => 'El correo electrónico del centro no puede tener más de 255 caracteres']);
                    exit;
                }

                // --------------------------- FIN DE VALIDACIONES---------------------------
                /**
                 * Realizar la modificación del centro en la base de datos.
                 *
                 * @var array $resultado Resultado del intento de actualización.
                 */
                $resultado = $this->objCentro->modificarCentro(
                    $emailReferencia,
                    $nombreCentro,
                    $direccionCentro,
                    $cpCentro,
                    $localidadCentro,
                    $telefonoCentro,
                    $emailCentro
                );

                if($resultado['success']) {
                // Responder con el resultado en formato JSON
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
                } else {
                // Respuesta de error en formato JSON
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
                }
            }
    
        /**
         * Elimina un centro educativo a partir de su correo electrónico de referencia.
         *
         * Esta función recibe desde el frontend el correo electrónico que identifica
         * de forma única al centro a eliminar. Si se proporciona correctamente,
         * se invoca al modelo para ejecutar la operación y se devuelve el resultado en formato JSON.
         *
         * @return void
         */
        public function eliminarCentro()
        {
            verificarTokenYCorreo();
            // Leer los datos enviados desde el frontend en formato JSON
            $inputData = json_decode(file_get_contents('php://input'), true);

            // Validar que el correo electrónico de referencia está presente
            if (isset($inputData['emailReferencia'])) {
                $emailReferencia = $inputData['emailReferencia'];

                // Llamar al modelo para eliminar el centro correspondiente
                $resultado = $this->objCentro->eliminarCentro($emailReferencia);

                // Devolver la respuesta del modelo como JSON
                header('Content-Type: application/json');
                echo json_encode($resultado);
                exit;
            } else {
                // Responder con error si faltan datos
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
                exit;
            }
        }
    }

?>