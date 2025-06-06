import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedService } from '../services/shared.service';

/**
 * Guard que restringe el acceso a rutas según el rol del usuario.
 * Actualmente solo permite acceso al rol admin (rol = 2).
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    /**
   * Constructor del guard.
   * @param sharedService Servicio compartido para obtener información del usuario
   * @param router Servicio de navegación
   */
  constructor(private sharedService: SharedService, private router: Router) {}

  /**
   * Determina si el usuario puede activar la ruta protegida.
   * Solo permite acceso si el rol es 2 (administrador).
   *
   * @returns `true` si el acceso está permitido, o redirige si está denegado
   */
  canActivate(): boolean | UrlTree {
    const rol = this.sharedService.getIdRol();
    console.log('RoleGuard - rol actual:', rol);

    if (rol === null) {
      // No hay rol guardado, redirige a no autorizado
      return this.router.parseUrl('/no-autorizado');
    }

    //Solo tiene permiso el rol admin
    if (rol === 2) {
      return true;
    } else {
      return this.router.parseUrl('/no-autorizado');
    }
  }
}
