import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  BDpath = 'http://localhost:8000/index.php?controlador=cUsuario&accion=';

  constructor(private http: HttpClient) {}

  // Get a user list with or without params
  getUsersByParams(params: any): Observable<User[]> {
    return this.http.get<any>(this.BDpath + 'getUsersByParams', {params: params});
  }

}
