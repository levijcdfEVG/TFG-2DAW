import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuariosActualizados$: any;
  notificarCambio() {
    throw new Error('Method not implemented.');
  }

  userPath = environment.apiUrl+'?controlador=cUsuario&accion=';

  constructor(private http: HttpClient) {}

  // Mostrar usuarios con o sin parametros de filtro
  getUsersByParams(params: any): Observable<any> {
    // Convertir los parámetros a HttpParams
    const httpParams = new HttpParams({ fromObject: params });
    console.log(this.userPath + 'getUsersByParams', { params: httpParams });
    return this.http.get<any>(this.userPath + 'getUsersByParams', { params: httpParams })
      .pipe(
        map(res => res.data), catchError(this.handleError)
      );
  }

   //Obtener lista de usuarios según el centro
  getUsersByCentro(params: any): Observable<any> {
    // Convertimos el objeto params a HttpParams para la consulta GET
    const httpParams = new HttpParams({ fromObject: params });
    console.log(this.userPath + 'getUsersByCentro', { params: httpParams });

    return this.http.get<any>(this.userPath + 'getUsersByCentro', { params: httpParams })
    .pipe(
      map(res => {
        // El backend devuelve un objeto { success, message, data }
        if (res && res.success) {
          return res.data;  // Aquí devuelves directamente el array de usuarios
        } else {
          // Aquí puedes lanzar error para que el subscribe lo capture
         throw new Error(res?.message || 'Error al obtener usuarios por centro');
        }
      }),
      catchError((err) => {
        // 👇 Para capturar errores inesperados del servidor (status 500, etc.)
        console.error('Error en servicio getUsersByCentro:', err);
        return throwError(() => err);
      })
    );
  }

  // Obtener un usuario por su id
  getUserById(userId: number): Observable<User> {
    const params = new HttpParams().set('id', userId.toString());
    return this.http.get<any>(this.userPath + 'getUserById', { params })
      .pipe(
        map(res => res.data),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo usuario
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.userPath + 'createUser', user)
        .pipe(catchError(this.handleError));
  }

  // Actualizar un usuario
  updateUser(userData: any): Observable<any> {
    return this.http.put<any>(this.userPath + 'updateUser', userData)
        .pipe(catchError(this.handleError));
  }

  // Eliminar un usuario
  deleteUser(userId: number): Observable<any> {
    const params = new HttpParams().set('id', userId.toString());
    return this.http.delete<any>(this.userPath + 'deleteUser', { params })
        .pipe(catchError(this.handleError));
  }

  // Cambiar el estado del usuario
  changeStatus(userId: number): Observable<any> {
    const params = new HttpParams().set('id', userId.toString());
    return this.http.put<any>(this.userPath + 'changeStatus', null, { params })
      .pipe(catchError(this.handleError));
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
