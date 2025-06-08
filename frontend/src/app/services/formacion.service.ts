/**
 * Servicio para gestionar las operaciones relacionadas con formaciones.
 * Incluye métodos para obtener, crear, editar, desactivar y gestionar usuarios asignados.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.es>
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AddCentroPayload, FormacionResponse } from '../services/interfaces/formacionesResponse';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../environments/environment.prod";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FormacionService {
  private backendUrl = environment.apiUrl;
  private formacionAEditar = new BehaviorSubject<any>(null);
  public idFormacion = new BehaviorSubject<number>(0);

  constructor(
      private http: HttpClient,
      private toastr: ToastrService
  ) { }

  /**
   * Obtiene todas las formaciones del backend.
   * @returns Observable con la respuesta del backend.
   */
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

  /**
   * Inserta una nueva formación en el backend.
   * @param data Datos de la formación, módulos, objetivos, centros y cursos.
   * @returns Observable con la respuesta del backend.
   */
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

  /**
   * Edita una formación existente.
   * @param data Datos actualizados de la formación.
   * @returns Observable con la respuesta del backend.
   */
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

  /**
   * Desactiva una formación por su ID.
   * @param id ID de la formación.
   * @returns Observable con la respuesta del backend.
   */
  public desactivarFormacion(id: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=desactivarFormacion`;
    return this.http.post<any>(url, { id });
  }

  /**
   * Obtiene los usuarios asignados a una formación.
   * @param idFormacion ID de la formación.
   * @returns Observable con los usuarios asignados.
   */
  public getUsersByFormacion(idFormacion: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getUsersByFormacion&idFormacion=${idFormacion}`;
    return this.http.get<any>(url);
  }

  public getFormationByUserId(userId: number): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=getFormationByUserId&id=${userId}`;
    return this.http.get<any>(url);
  }

  /**
   * Desasigna usuarios de una formación.
   * @param idFormacion ID de la formación.
   * @param idsUsuarios Lista de IDs de usuarios a desasignar.
   * @returns Observable con la respuesta del backend.
   */
  public unasignUsersByFormacion(idFormacion: number, idsUsuarios: number[]): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=unasignUsersByFormacion`;
    return this.http.post<any>(url, { idFormacion, idsUsuarios });
  }

  /**
   * Asigna usuarios a una formación.
   * @param idFormacion ID de la formación.
   * @param idsUsuarios Lista de IDs de usuarios a asignar.
   * @returns Observable con la respuesta del backend.
   */
  public asignUserFormacion(idFormacion: number, idsUsuarios: number[]): Observable<any> {
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=asignUserFormacion`;
    return this.http.post<any>(url, { idFormacion, idsUsuarios });
  }

  /**
   * Devuelve el observable de la formación que se está editando.
   * @returns Observable de la formación a editar.
   */
  public getFormacionAEditar(): Observable<any> {
    return this.formacionAEditar.asObservable();
  }

  /**
   * Establece la formación que se va a editar.
   * @param formacion Objeto de formación.
   */
  public setFormacionAEditar(formacion: any): void {
    this.formacionAEditar.next(formacion);
  }

  /**
   * Devuelve el observable del ID de la formación seleccionada.
   * @returns Observable del ID de formación.
   */
  public getIdFormacion(): Observable<number> {
    return this.idFormacion.asObservable();
  }

  /**
   * Establece el ID de la formación seleccionada.
   * @param idFormacion ID de la formación.
   */
  public setIdFormacion(idFormacion: number): void {
    this.idFormacion.next(idFormacion);
  }

  public cambiarEstado(id_formacion: number, id_usu: number): Observable<any>{
    const params = new HttpParams().set ('id_formacion', id_formacion.toString())
                                              .set ('id_usu', id_usu.toString() );
    const url = `${this.backendUrl}?controlador=cFormaciones&accion=cambiarEstado`;
    console.log(url, params);
    return this.http.put<any>(url, null, { params });
  }
}
