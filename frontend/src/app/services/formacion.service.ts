import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AddCentroPayload, FormacionResponse} from '../services/interfaces/formacionesResponse';
import { ToastrService } from 'ngx-toastr';
import {error} from "@angular/compiler-cli/src/transformers/util";
import { environment } from "../../environments/environment.prod";
import { localEnvironment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormacionService {
  private backendUrl = environment.apiUrl;
  private formacionAEditar = new BehaviorSubject<any>(null)

  constructor(private http: HttpClient,
              private toastr: ToastrService) { }

  public getAllFormaciones(): Observable<FormacionResponse> {
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
        error: (response) => {
          this.toastr.error("Error al cargar las formaciones", "CRUD Formaciones", {
            positionClass: "toast-bottom-right"
          });
          console.error(response);
        }
      })
    );
  }

  public insertarFormacion(data: any): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=crearFormacion`;
    const payloadData = {
      formacion: data.formacion,
      modulos: data.modulos,
      objetivos: data.objetivos,
      centros: data.centros ?? [],
      cursos: [data.curso_inicio, data.curso_fin]
    };
    return this.http.post<any>(url, payloadData);
  }

  public editarFormacion(data: any): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=updateFormacion`;
    const payloadData = {
      id: data.id,
      formacion: data.formacion,
      modulos: data.modulos,
      objetivos: data.objetivos,
      centros: data.centros ?? [],
      cursos: [data.curso_inicio, data.curso_fin]
    };
    return this.http.post<any>(url, payloadData);
  }


  public desactivarFormacion(id: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=desactivarFormacion`;

    return this.http.post<any>(url, { id });
  }

  public getUsersByFormacion(idFormacion: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getUsersByFormacion`;
    console.log(idFormacion);

    return this.http.post<any>(url, {idFormacion});
  }

  public getFormacionAEditar(): Observable<any> {
    return this.formacionAEditar.asObservable();
  }

  public setFormacionAEditar(formacion: any) {
    this.formacionAEditar.next(formacion);
  }


}
