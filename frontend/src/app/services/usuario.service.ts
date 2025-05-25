import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private userPath = 'http://localhost:8000/index.php?controlador=CUsuario&accion=';

  constructor(private http: HttpClient) {}

  // Get a user list with or without params
  getUsersByParams(params: any): Observable<User[]> {
    // Convertir los parámetros a HttpParams
    const httpParams = new HttpParams({ fromObject: params });

    return this.http.get<any>(this.userPath + 'getUsersByParams', { params: httpParams })
      .pipe(
        map(res => res.data),
        catchError(this.handleError)
      );
  }

  getUserById(userId: any): Observable<User> {
    return this.http.get<any>(this.userPath + 'getUser')
      .pipe(
        map(res => res.data),
      )
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
