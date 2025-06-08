import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedService } from '../services/shared.service';

/**
 * Guard que impide el acceso a la ruta /info-formaciones
 * si el usuario tiene rol 1 (educador).
 */
@Injectable({
  providedIn: 'root'
})
export class FormacionesGuard implements CanActivate {

  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const rol = this.sharedService.getIdRol();
    console.log('FormacionesGuard - rol actual:', rol);

    if (rol === 1) {
      // Si el rol es 1 (educador), se deniega el acceso
     this.router.navigate(['/no-autorizado']);
      return false;
    }

    // Se permite el acceso para otros roles
    return true;
  }
}
