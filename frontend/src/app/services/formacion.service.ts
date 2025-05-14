import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from 'rxjs';
import { FormacionResponse } from '../services/interfaces/formacionesResponse';


@Injectable({
  providedIn: 'root'
})
export class FormacionService {
  private backendUrl = 'http://localhost:8000/index.php';

  constructor(private http: HttpClient) { }

  getAllFormaciones(): Observable<FormacionResponse> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getAllFormaciones`;

    return this.http.get<FormacionResponse>(url);
  }

}
