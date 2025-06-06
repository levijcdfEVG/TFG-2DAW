<?php
require_once MODELS . 'mMenu.php';

/**
 * Controlador del menú principal.
 *
 * Gestiona las solicitudes relacionadas con el menú principal. 
 * Extrae los datos del usuario que ha iniciado sesión.
 *
 * @category Controller
 * @package  TFG-2DAW
 * @author   David Silva Vega <dsilvavega.guadalupe@alumnado.fundacionloyola.net>
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://example.com
 */

class cMenu
{
    /**
     * Instancia del modelo mMenu.
     *
     * @var mMenu
     */
    private $objMenu;

   /**
     * Constructor de la clase cMenu.
     *
     * Inicializa el modelo mMenu para acceder a la lógica de negocio relacionada 
     * con el menú principal del sistema.
     */

    public function __construct()
    {
        $this->objMenu = new mMenu();
    }

   /**
     * Devuelve la información de un usuario.
     *
     * Llama al modelo para recuperar los datos del usuario según su dirección de correo
     * electrónico (email) y devuelve la información en formato JSON.
     *
     * @return void
     */

    public function userInfo(){
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        $email = $input['email'] ?? null;

        if (!$email) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el parámetro email.']);
            exit;
        }

        $resultado = $this->objMenu->userInfo($email);

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }


    public function getUserByDay(){
        $resultado = $this->objMenu->getUserByDay();

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }

    public function getFormationActiveByMonth() {
        $resultado = $this->objMenu->getFormationActiveByMonth();

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }


    public function getUserByCenter() {
        $resultado = $this->objMenu->getUserByCenter();

        header('Content-Type: application/json');
        echo json_encode($resultado);
        exit;
    }
}
?>