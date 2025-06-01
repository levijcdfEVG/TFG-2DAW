import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private idCentro: number | null = null;
  private idRol: number | null = null;
  private idUsuario: number | null = null;

  setIdCentro(id: number): void {
    this.idCentro = id;
    localStorage.setItem('idCentro', id.toString());
  }

  getIdCentro(): number | null {
    if (this.idCentro === null) {
      const stored = localStorage.getItem('idCentro');
      this.idCentro = stored !== null ? +stored : null;
    }
    return this.idCentro;
  }

  setIdRol(id: number): void {
    this.idRol = id;
    localStorage.setItem('idRol', id.toString());
    console.log('Rol guardado en localStorage:', localStorage.getItem('idRol'));
  }

  getIdRol(): number | null {
    if (this.idRol === null) {
      const stored = localStorage.getItem('idRol');
      this.idRol = stored !== null ? +stored : null;
      console.log('Rol recuperado de localStorage:', this.idRol);
    }
    return this.idRol;
  }

  setIdUsuario(id: number): void {
    this.idUsuario = id;
    localStorage.setItem('idUsuario', id.toString());
  }

  getIdUsuario(): number | null {
    if (this.idUsuario === null) {
      const stored = localStorage.getItem('idUsuario');
      this.idUsuario = stored !== null ? +stored : null;
    }
    return this.idUsuario;
  }

  clearAll(): void {
    this.idCentro = null;
    this.idRol = null;
    this.idUsuario = null;
    localStorage.removeItem('idCentro');
    localStorage.removeItem('idRol');
    localStorage.removeItem('idUsuario');
  }
}
