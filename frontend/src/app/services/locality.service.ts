import { Locality } from './../interfaces/locality.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  private localityPath = environment.apiUrl+'?controlador=cLocalidad&accion=';

  constructor(private http: HttpClient) { }

  getAllLocalities(): Observable<Locality[]> {
    return this.http.get<any>(this.localityPath + 'getAllLocalities')
    .pipe(
        map(res => res.data), catchError(this.handleError)   
    );
  }

  getLocalityById(localityId: number): Observable<Locality> {
    const params = new HttpParams().set('id', localityId.toString());
    return this.http.get<any>(this.localityPath + 'getLocalityById', { params })
    .pipe(
        map(res => res.data), catchError(this.handleError)
    );
  }

//   getLocalityByProvince(provinceId: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}?province_id=${provinceId}`);
//   }

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