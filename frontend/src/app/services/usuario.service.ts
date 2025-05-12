import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {}

  urlBase = 'http://localhost:8000/backend/src/index.php?controlador=cUsuarios&accion=';

  // Método para obtener la lista de usuarios
  getUsuarios(): Observable<any> {
    return this.http.get<any>(this.urlBase+'listaUsuarios');
  }

  private usuariosActualizados = new Subject<void>();

  get usuariosActualizados$() {
    return this.usuariosActualizados.asObservable();
  }

  notificarCambio(): void {
    this.usuariosActualizados.next();
  }

  crearUsuario(usuario: any): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new URLSearchParams();

    if (!usuario.nombre ||
        !usuario.apellidos ||
        !usuario.email ||
        !usuario.telefono ||
        !usuario.dni) {
      return throwError(() => new Error('Todos los campos son obligatorios.'));
    }

    body.set('nombre', usuario.nombre);
    body.set('apellidos', usuario.apellidos);
    body.set('email', usuario.email);
    body.set('telefono', usuario.telefono);
    body.set('dni', usuario.dni);

    return this.http.post<any>(this.urlBase+'insertIntoUsuarios',
        body.toString(),
        { headers }
    );
  }

  modificarUsuario(emailReferencia: string, datosModificados: any): Observable<any> {
    return this.http.put<any>(this.urlBase+'modificarUsuario', { emailReferencia, datosModificados });
  }

  eliminarUsuario(emailReferencia: string): Observable<any> {
    return this.http.delete<any>(this.urlBase+'eliminarUsuario', { body: { emailReferencia } });
  }

  validarUsuario(dni: string, email: string): Observable<any> {
    const body = { dni: dni, email: email };
    return this.http.post<any>(this.urlBase + 'validarUsuario', body);
  }

  // Método para buscar usuarios con filtros
  buscarUsuarios(filtros: any): Observable<any> {
    let params = new HttpParams();
    
    // Agregar solo los filtros que tengan valor
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params = params.set(key, filtros[key]);
      }
    });

    return this.http.get<any>(this.urlBase + 'listaUsuarios', { params });
  }
}
