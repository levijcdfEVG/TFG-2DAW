import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }
  urlBase = 'http://localhost:8000/index.php?controlador=cMenu&accion=';

  getUserInfo(email: string): Observable<any> {
    return this.http.post<any>(this.urlBase+'userInfo', { email });
  }
}
