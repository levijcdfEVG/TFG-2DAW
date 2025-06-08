import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedService } from '../services/shared.service';

/**
 * Guard que impide el acceso a la ruta /info-educadores
 * si el usuario tiene rol 1 (educador).
 */
@Injectable({
  providedIn: 'root'
})
export class EducadoresGuard implements CanActivate {

  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const rol = this.sharedService.getIdRol();
    console.log('EducadoresGuard - rol actual:', rol);

    if (rol === 1) {
      // Rol 1 no autorizado para /info-educadores
      this.router.navigate(['/no-autorizado']);
      return false;
    }

    // Permitir acceso para otros roles
    return true;
  }
}
