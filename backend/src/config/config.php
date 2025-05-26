<?php
/**
 * Definición de rutas y configuraciones globales del proyecto.
 *
 * Este archivo establece constantes que apuntan a distintas rutas dentro de la estructura
 * del proyecto, como directorios de estilos, imágenes, configuraciones, modelos y controladores.
 *
 * @category Configuración
 * @package  TFG-2DAW
 * @author   David Silva Vega <dsilvavega.guadalupe@alumnado.fundacionloyola.net>
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://example.com
 */

/** Ruta al directorio de archivos CSS */
define('CSS', 'assets/css/');

/** Ruta al directorio principal de imágenes */
define('IMG', 'assets/img/');

/** Ruta al subdirectorio de imágenes de banderas */
define('BANDERAS', 'assets/img/banderas/');

/** Ruta al subdirectorio de fotos de usuarios u otros elementos */
define('FOTOS', 'assets/img/fotos/');

/** Ruta al directorio de archivos de configuración */
define('CONFIG', 'config/');

/** Ruta al directorio de modelos del proyecto */
define('MODELS', 'models/');

/** Ruta al directorio de controladores del proyecto */
define('CONTROLLERS', 'controllers/');

/**
 * ID de cliente de Google OAuth 2.0
 *
 * Utilizado para la autenticación con servicios de Google.
 */
define('GOOGLEID', '759419410954-niiprm9ddsbrn2pv833vbdista3mi6nr.apps.googleusercontent.com');
?>