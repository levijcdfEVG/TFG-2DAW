import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';
import { environment } from "../../environments/environment.prod";
import {SharedService} from "./shared.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para operaciones relacionadas con el menú de navegación y la información del usuario logueado.
 */
export class MenuService {



  constructor(
      private http: HttpClient,
      private shared: SharedService) { }

    /** URL base del backend para las operaciones del menú */
  urlBase = environment.apiUrl+'?controlador=cMenu&accion=';

    /**
   * Obtiene la información del usuario a partir de su correo electrónico.
   * Suele utilizarse para mostrar nombre, rol, etc. en la interfaz.
   *
   * @param email Correo electrónico del usuario
   * @returns Observable con la información del usuario desde el backend
   */
  getUserInfo(email: string): Observable<any> {
    return this.http.post<any>(this.urlBase+'userInfo', { email });
  }

  getUserByDay(): Observable<any> {
    return this.http.get<any>(this.urlBase+'getUserByDay');
  }

  getFormationActiveByMonth(): Observable<any> {
    return this.http.get<any>(this.urlBase+'getFormationActiveByMonth');
  } 

  getUserByCenter(): Observable<any> {
    return this.http.get<any>(this.urlBase+'getUserByCenter');
  }


  //Responsable
  getUserByDayResponsable(): Observable<any> {
    const centro = this.shared.getIdCentro();
    console.log("Datos de responsable del centro:", centro);

    if (centro == null) {
      throw new Error("No hay centro válido para sacar datos");
    }

    return this.http.get<any>(`${this.urlBase}getUserByDayResponsable&id_centro=${centro}`);
  }

  getFormationActiveByMonthResponsable(): Observable<any> {
    const centro = this.shared.getIdCentro();
    console.log("Datos de responsable del centro:", centro);


    if (centro == null) {
      throw new Error("No hay centro válido para sacar datos");
    }

    return this.http.get<any>(`${this.urlBase}getFormationActiveByMonthResponsable&id_centro=${centro}`);
  }

  getUserByCenterResponsable(): Observable<any> {
    const centro = this.shared.getIdCentro();
    console.log("Datos de responsable del centro:", centro);


    if (centro == null) {
      throw new Error("No hay centro válido para sacar datos");
    }

    return this.http.get<any>(`${this.urlBase}getUserByCenterResponsable&id_centro=${centro}`);
  }

}
