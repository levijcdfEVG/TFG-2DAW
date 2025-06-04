import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio compartido para almacenar y recuperar información básica del usuario
 * como el ID del centro, rol y usuario. Utiliza `localStorage` para persistencia.
 */
export class SharedService {

    /** ID del centro al que pertenece el usuario */
  private idCentro: number | null = null;

   /** ID del rol del usuario (admin, educador, responsable) */
  private idRol: number | null = null;

    /** ID del usuario autenticado */
  private idUsuario: number | null = null;


    /**
   * Almacena el ID del centro en memoria y en `localStorage`.
   * @param id ID del centro
   */
  setIdCentro(id: number): void {
    this.idCentro = id;
    localStorage.setItem('idCentro', id.toString());
  }

    /**
   * Recupera el ID del centro desde memoria o `localStorage`.
   * @returns ID del centro o `null` si no existe
   */
  getIdCentro(): number | null {
    if (this.idCentro === null) {
      const stored = localStorage.getItem('idCentro');
      this.idCentro = stored !== null ? +stored : null;
    }
    return this.idCentro;
  }

    /**
   * Almacena el ID del rol en memoria y en `localStorage`.
   * @param id ID del rol
   */
  setIdRol(id: number): void {
    this.idRol = id;
    localStorage.setItem('idRol', id.toString());
    console.log('Rol guardado en localStorage:', localStorage.getItem('idRol'));
  }

    /**
   * Recupera el ID del rol desde memoria o `localStorage`.
   * @returns ID del rol o `null` si no existe
   */
  getIdRol(): number | null {
    if (this.idRol === null) {
      const stored = localStorage.getItem('idRol');
      this.idRol = stored !== null ? +stored : null;
      console.log('Rol recuperado de localStorage:', this.idRol);
    }
    return this.idRol;
  }

    /**
   * Almacena el ID del usuario en memoria y en `localStorage`.
   * @param id ID del usuario
   */
  setIdUsuario(id: number): void {
    this.idUsuario = id;
    localStorage.setItem('idUsuario', id.toString());
  }

    /**
   * Recupera el ID del usuario desde memoria o `localStorage`.
   * @returns ID del usuario o `null` si no existe
   */
  getIdUsuario(): number | null {
    if (this.idUsuario === null) {
      const stored = localStorage.getItem('idUsuario');
      this.idUsuario = stored !== null ? +stored : null;
    }
    return this.idUsuario;
  }

    /**
   * Limpia los datos de usuario y centro tanto de memoria como de `localStorage`.
   */
  clearAll(): void {
    this.idCentro = null;
    this.idRol = null;
    this.idUsuario = null;
    localStorage.removeItem('idCentro');
    localStorage.removeItem('idRol');
    localStorage.removeItem('idUsuario');
  }
}
