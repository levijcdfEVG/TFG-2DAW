import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  userPath = 'http://localhost:8000/index.php?controlador=cUsuario&accion=';
  
  private usuariosActualizados = new Subject<void>();

  get usuariosActualizados$() {
    return this.usuariosActualizados.asObservable();
  }

  notificarCambio(): void {
    this.usuariosActualizados.next();
  }

  constructor(private http: HttpClient) {}

  // Mostrar usuarios con o sin parametros de filtro
  getUsersByParams(params: any): Observable<any> {
    // Convertir los parámetros a HttpParams
    const httpParams = new HttpParams({ fromObject: params });
    // console.log(this.userPath + 'getUsersByParams', { params: httpParams });
    return this.http.get<any>(this.userPath + 'getUsersByParams', { params: httpParams })
      .pipe(
        map(res => res.data), catchError(this.handleError)
      );
  }

  // Obtener un usuario por su id
  getUserById(userId: number): Observable<User> {
    const params = new HttpParams().set('id', userId.toString());
    console.log(this.userPath + `getUserById&${userId}`);
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
  updateUser(user: User): Observable<any> {
    return this.http.put<any>(this.userPath + 'updateUser', user)
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
