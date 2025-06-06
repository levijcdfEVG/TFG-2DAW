import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError, BehaviorSubject} from "rxjs";
import { Role } from '../interfaces/role.interface';
import {map, catchError} from "rxjs/operators";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de manejar la obtención de roles desde el backend.
 */
export class RoleService {

    /** URL base para las peticiones relacionadas con roles */
  private rolePath = environment.apiUrl+'?controlador=cRol&accion=';

  // Centralización del rol
  private rolSubject = new BehaviorSubject<'admin' | 'responsable' | 'educador'>('educador');
  rol$ = this.rolSubject.asObservable();

  setRol(rol: 'admin' | 'responsable' | 'educador') {
    this.rolSubject.next(rol);
  }

  getRol(): 'admin' | 'responsable' | 'educador' {
    return this.rolSubject.value;
  }

  constructor(private http: HttpClient) { }

    /**
   * Obtiene todos los roles disponibles desde el backend.
   * @returns Observable con un array de objetos de tipo `Role`
   */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<any>(this.rolePath + 'getAllRoles')
        .pipe(
            map(res => res.data), catchError(this.handleError)
        );
  }

    /**
   * Maneja los errores de las peticiones HTTP.
   * @param error Objeto de error de tipo HttpErrorResponse
   * @returns Observable que emite un mensaje de error legible
   */
  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || 'Error desconocido del servidor';
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
}
