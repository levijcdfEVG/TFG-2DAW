import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentrosService {
  private apiUrl = 'http://localhost:8000/backend/src/index.php?controlador=cCentros&accion=listaCentros'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de centros
  getCentros(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  crearCentro(centro: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/backend/src/index.php?controller=cCentros&accion=crearCentro', centro);
  }

  modificarCentro(centro: any): Observable<any> {
    return this.http.put<any>('http://localhost:8000/backend/src/index.php?controller=cCentros&accion=modificarCentro', centro);
  }
}
