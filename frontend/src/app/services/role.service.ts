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
    const errorMessage = error.error?.message || 'Error desconocido del servidor';
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
}
