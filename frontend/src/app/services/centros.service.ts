import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CentroModificado } from '../interfaces/centroModificado.model';
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para gestionar operaciones relacionadas con los centros educativos.
 * Proporciona métodos para crear, modificar, eliminar, listar y validar centros.
 */
export class CentrosService {

  constructor(private http: HttpClient) {}

    /** URL base para las peticiones HTTP al backend */
  urlBase = environment.apiUrl+'?controlador=cCentros&accion=';


   /**
   * Obtiene la lista de todos los centros registrados.
   * @returns Observable con la respuesta del backend
   */
  getCentros(): Observable<any> {
    return this.http.get<any>(this.urlBase+'listaCentros');
  }

    /** Subject que notifica a los suscriptores sobre cambios en la lista de centros */
  private centrosActualizados = new Subject<void>();

    /**
   * Observable que permite a los componentes suscribirse a los cambios de centros.
   */
  get centrosActualizados$() {
    return this.centrosActualizados.asObservable();
  }

    /**
   * Notifica a todos los suscriptores que se ha realizado un cambio en la lista de centros.
   */
  notificarCambio(): void {
    this.centrosActualizados.next();
  }

    /**
   * Crea un nuevo centro en el sistema.
   * @param centro Objeto que contiene los datos del nuevo centro
   * @returns Observable con la respuesta del backend
   */
  crearCentro(centro: any): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }; // Asegúrate de usar el encabezado correcto
    const body = new URLSearchParams(); // Formatear los datos como x-www-form-urlencoded
  
    // Validar que todos los campos estén llenos
  if (!centro.nombre_centro || 
    !centro.direccion_centro || 
    !centro.cp || 
    !centro.nombre_localidad || 
    !centro.telefono_centro || 
    !centro.correo_centro) {
  return throwError(() => new Error('Todos los campos son obligatorios.'));
}
    // Agregar los datos al cuerpo de la solicitud
    body.set('nombre_centro', centro.nombre_centro);
    body.set('direccion_centro', centro.direccion_centro);
    body.set('cp', centro.cp);
    body.set('nombre_localidad', centro.nombre_localidad);
    body.set('telefono_centro', centro.telefono_centro);
    body.set('correo_centro', centro.correo_centro);
  
    return this.http.post<any>(this.urlBase+'insertIntoCentros',
      body.toString(), // Convertir a string
      { headers }
    );
  }

    /**
   * Modifica un centro ya existente en el sistema.
   * @param emailReferencia Correo electrónico del centro que se va a modificar
   * @param datosModificados Objeto con los nuevos datos del centro
   * @returns Observable con la respuesta del backend
   */
  modificarCentro(emailReferencia: string, datosModificados: CentroModificado): Observable<any> {
    return this.http.put<any>(this.urlBase+'modificarCentro', { emailReferencia, datosModificados });
  }

    /**
   * Elimina un centro del sistema.
   * @param emailReferencia Correo electrónico que identifica al centro a eliminar
   * @returns Observable con la respuesta del backend
   */
  eliminarCentro(emailReferencia: string): Observable<any> {
    return this.http.delete<any>(this.urlBase+'eliminarCentro', { body: { emailReferencia } });
  }

    /**
   * Valida si el código postal coincide con el nombre de la localidad.
   * @param nombreLocalidad Nombre de la localidad
   * @param cp Código postal
   * @returns Observable con la respuesta de validación del backend
   */
  validarLocalidad(nombreLocalidad: string, cp: string): Observable<any> {
    const body = { nombre_localidad: nombreLocalidad, cp: cp };
    return this.http.post<any>(this.urlBase + 'validarLocalidad', body);
  }
}

/**
 * Función placeholder personalizada para lanzar errores.
 * @param arg0 Función que retorna un objeto Error
 * @returns Nunca retorna — lanza un error directamente
 */
function throwError(arg0: () => Error): Observable<any> {
  throw new Error('Function not implemented.');
}

