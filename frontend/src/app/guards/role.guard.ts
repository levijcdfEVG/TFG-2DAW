import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const rol = this.sharedService.getIdRol();
    console.log('RoleGuard - rol actual:', rol);

    if (rol === null) {
      // No hay rol guardado, redirige a no autorizado
      return this.router.parseUrl('/no-autorizado');
    }

    // Aquí decides qué roles permiten acceso.
    // Por ejemplo, solo admin (rol = 2) puede entrar:
    if (rol === 2) {
      return true;
    } else {
      return this.router.parseUrl('/no-autorizado');
    }
  }
}
