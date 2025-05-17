import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from 'rxjs';
import { FormacionResponse } from '../services/interfaces/formacionesResponse';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FormacionService {
  private backendUrl = 'http://localhost:8000/index.php';

  constructor(private http: HttpClient,
              private toastr: ToastrService) { }

  getAllFormaciones(): Observable<FormacionResponse> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getAllFormaciones`;
    return this.http.get<FormacionResponse>(url).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.toastr.success("Formaciones cargadas exitosamente", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          } else {
            this.toastr.error("Error al cargar las formaciones", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        },
        error: () => {
          this.toastr.error("Error al cargar las formaciones", "CRUD Formaciones", {
            positionClass: "toast-bottom-right"
          });
        }
      })
    );
  }

  insertarFormacion(data: any): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=insertarFormacion`;
    return this.http.post<any>(url, data).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.toastr.success("Formación creada exitosamente", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          } else {
            this.toastr.error("Error al crear la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        },
        error: () => {
          this.toastr.error("Error al crear la formación", "CRUD Formaciones", {
            positionClass: "toast-bottom-right"
          });
        }
      })
    );
  }

  desactivarFormacionPorId(id: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=desactivarFormacionPorId`;
    return this.http.post<any>(url, { id }).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.toastr.success("Formación desactivada exitosamente", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          } else {
            this.toastr.error("Error al desactivar la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        },
        error: () => {
          this.toastr.error("Error al desactivar la formación", "CRUD Formaciones", {
            positionClass: "toast-bottom-right"
          });
        }
      })
    );
  }


}
