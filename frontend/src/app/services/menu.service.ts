import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }
  urlBase = environment.apiUrl+'?controlador=cMenu&accion=';

  getUserInfo(email: string): Observable<any> {
    return this.http.post<any>(this.urlBase+'userInfo', { email });
  }

  getUserByDay(): Observable<any> {
    return this.http.get<any>(this.urlBase+'getUserByDay').pipe(map(res => res.data));
  }

  getActividadUsuarios(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/estadisticas/actividad-usuarios`);
  }
}
