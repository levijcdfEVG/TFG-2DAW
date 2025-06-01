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
  }

  getIdCentro(): number | null {
    return this.idCentro;
  }

  setIdRol(id: number): void {
    this.idRol = id;
  }

  getIdRol(): number | null {
    return this.idRol;
  }
  setIdUsuario(id: number): void {
    this.idUsuario = id;
  }
  getIdUsuario(): number | null {
    return this.idUsuario;
  }

}

