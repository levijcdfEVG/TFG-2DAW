import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsersByFilter(filter: any): Observable<User[]> {
    let params = new HttpParams();
    
    // Añadir cada filtro al HttpParams si tiene valor
    if (filter.nombre) params = params.set('nombre', filter.nombre);
    if (filter.apellidos) params = params.set('apellidos', filter.apellidos);
    if (filter.email) params = params.set('email', filter.email);
    if (filter.telefono) params = params.set('telefono', filter.telefono);
    if (filter.rol && filter.rol !== '0') params = params.set('rol', filter.rol);
    if (filter.nuevo_educador !== null) params = params.set('nuevo_educador', filter.nuevo_educador);
    if (filter.estado !== null) params = params.set('estado', filter.estado);

    console.log('Parámetros de búsqueda:', params.toString()); // Para debugging

    return this.http.get<User[]>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
