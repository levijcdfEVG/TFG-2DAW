import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CentroModificado } from '../interfaces/centroModificado.model';

@Injectable({
  providedIn: 'root'
})
export class CentrosService {

  constructor(private http: HttpClient) {}

  urlBase = 'http://localhost:8000/index.php?controlador=cCentros&accion=';

  // Método para obtener la lista de centros
  getCentros(): Observable<any> {
    return this.http.get<any>(this.urlBase+'listaCentros');
  }

  private centrosActualizados = new Subject<void>();

  get centrosActualizados$() {
    return this.centrosActualizados.asObservable();
  }

  notificarCambio(): void {
    this.centrosActualizados.next();
  }

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

  modificarCentro(emailReferencia: string, datosModificados: CentroModificado): Observable<any> {
    return this.http.put<any>(this.urlBase+'modificarCentro', { emailReferencia, datosModificados });
  }

  eliminarCentro(emailReferencia: string): Observable<any> {
    return this.http.delete<any>(this.urlBase+'eliminarCentro', { body: { emailReferencia } });
  }

  validarLocalidad(nombreLocalidad: string, cp: string): Observable<any> {
    const body = { nombre_localidad: nombreLocalidad, cp: cp };
    return this.http.post<any>(this.urlBase + 'validarLocalidad', body);
  }
}
function throwError(arg0: () => Error): Observable<any> {
  throw new Error('Function not implemented.');
}

