import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AddCentroPayload, FormacionResponse} from '../services/interfaces/formacionesResponse';
import { ToastrService } from 'ngx-toastr';
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root'
})
export class FormacionService {
  private backendUrl = 'http://localhost:8000/index.php';
  private formacionAEditar = new BehaviorSubject<any>(null)

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
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=crearFormacion`;
    const payloadData = {
      formacion: data.formacion,
      modulos: data.modulos,
      objetivos: data.objetivos,
      centros: data.centros ?? [],
      cursos: data.cursos
    };
    return this.http.post<any>(url, payloadData);
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

  public getFormacionAEditar(): Observable<any> {
    return this.formacionAEditar.asObservable();
  }

  public setFormacionAEditar(formacion: any) {
    this.formacionAEditar.next(formacion);
  }


}
