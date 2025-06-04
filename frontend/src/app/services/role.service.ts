import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
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
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
