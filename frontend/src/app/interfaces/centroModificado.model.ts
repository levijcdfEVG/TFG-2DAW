/**
 * Representa los datos necesarios para modificar un centro educativo.
 */
export interface CentroModificado {
  /** Nombre del centro */
    nombre_centro: string;

     /** Dirección del centro */
    direccion_centro: string;

    /** Código postal (CP) del centro */
    cp: string;

    /** Nombre de la localidad en la que se ubica el centro */
    nombre_localidad: string;

    /** Número de teléfono de contacto del centro */
    telefono_centro: string;

    /** Correo electrónico  del centro */
    correo_centro: string;
  }