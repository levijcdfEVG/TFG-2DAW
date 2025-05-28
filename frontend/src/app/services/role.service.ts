import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import { Role } from '../interfaces/role.interface';
import {map, catchError} from "rxjs/operators";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private rolePath = environment.apiUrl+'?controlador=cRol&accion=';

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<any>(this.rolePath + 'getAllRoles')
        .pipe(
            map(res => res.data), catchError(this.handleError)
        );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
