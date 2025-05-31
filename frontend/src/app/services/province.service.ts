import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Province } from '../interfaces/province.interface';
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private provincePath = environment.apiUrl+'?controlador=cProvincia&accion=';

  constructor(private http: HttpClient) {}

  // Obtener todas las provincias
  getAllProvinces(): Observable<Province[]> {
    // console.log(this.provincePath + `getAllProvinces`);
    return this.http.get<any>(this.provincePath + 'getAllProvinces')
    .pipe(
        map(res => res.data), catchError(this.handleError)
    );
  }

  getProvinceById(provinceId: number): Observable<Province> {
    const params = new HttpParams().set('id', provinceId.toString());
    // console.log(this.provincePath + `getProvinceById=${provinceId}`);
    return this.http.get<any>(this.provincePath + 'getProvinceById', { params })
        .pipe(
            map(res => res.data), catchError(this.handleError)
        );
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