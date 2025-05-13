import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  BDpath = 'http://localhost:8000/backend/src/index.php?controlador=cCentros&accion=';

  constructor(private http: HttpClient) {}

  // Get a user list with or without params
  getUsersByParams(): Observable<User[]> {
    return this.http.get<User[]>(this.BDpath + 'getUsersByParams');
  }

}
