import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormacionService {

  private backendUrl = 'http://localhost:8000/index.php';
  private formacionesCargadas: any[] = [];
  private formacionSeleccionada: any = null;

  constructor(
      private http: HttpClient
  ) { }

  /**
   * Realiza una solicitud al backend para obtener todas las formaciones inactivas.
   * Si la respuesta es exitosa, guarda los datos en el array interno `formacionesCargadas`.
   *
   * @returns Observable que emite un objeto con las propiedades `success` y `data`,
   *          donde `data` es un array de formaciones.
   */
  getAllFormaciones(): Observable<FormacionResponse> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getAllFormaciones`;

    return this.http.get<FormacionResponse>(url).pipe(
        tap((response) => {
          if (response.success) {
            this.formacionesCargadas = response.data;
          } else {
            console.warn('Respuesta recibida sin datos válidos.');
          }
        })
    );
  }


  /**
   * Devuelve las formaciones ya cargadas en memoria.
   * @returns Array de formaciones.
   */
  getFormacionesCargadas(): any[] {
    return this.formacionesCargadas;
  }
}
