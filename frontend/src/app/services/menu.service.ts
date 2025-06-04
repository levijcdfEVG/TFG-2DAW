import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map,Observable, Subject } from 'rxjs';
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para operaciones relacionadas con el menú de navegación y la información del usuario logueado.
 */
export class MenuService {

  constructor(private http: HttpClient) { }

    /** URL base del backend para las operaciones del menú */
  urlBase = environment.apiUrl+'?controlador=cMenu&accion=';

    /**
   * Obtiene la información del usuario a partir de su correo electrónico.
   * Suele utilizarse para mostrar nombre, rol, etc. en la interfaz.
   *
   * @param email Correo electrónico del usuario
   * @returns Observable con la información del usuario desde el backend
   */
  getUserInfo(email: string): Observable<any> {
    return this.http.post<any>(this.urlBase+'userInfo', { email });
  }

  getUserByDay(): Observable<any> {
    return this.http.get<any>(this.urlBase+'getUserByDay').pipe(map(res => res.data));
  }

  getActividadUsuarios(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/estadisticas/actividad-usuarios`);
  }
}
