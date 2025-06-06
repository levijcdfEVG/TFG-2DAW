import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

/**
 * Guard que controla el acceso a rutas según el rol del usuario:
 * - Educador (rol 1): acceso solo a su perfil.
 * - Admin (rol 2): acceso total.
 * - Responsable (rol 3): acceso solo a perfiles dentro de su centro.
 */
@Injectable({
  providedIn: 'root'
})
export class ResponsableCentroGuard implements CanActivate {

    /**
   * Constructor del guard.
   * @param sharedService Servicio compartido para obtener ID de rol, usuario y centro
   * @param router Servicio de navegación
   * @param usuarioService Servicio para obtener información del usuario
   */
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private usuarioService: UsuarioService 
  ) {}

    /**
   * Determina si el usuario puede activar la ruta solicitada.
   * @param route Snapshot de la ruta activada, con los parámetros incluidos
   * @param state Snapshot del estado del router
   * @returns Un observable de booleano o un booleano que indica si se permite el acceso
   */
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const idRol = this.sharedService.getIdRol(); //Rol del usuario actual
    const idCentroResponsable = this.sharedService.getIdCentro(); //Centro del responsable
    const idUsuario = this.sharedService.getIdUsuario(); //id del usuario actual
    const idRuta = +route.params['id']; // id obtenido de la ruta

    //  Admin: acceso total
    if (idRol === 2) return true;

    // Educador: solo puede acceder a su propio perfil
    if (idRol === 1 && idUsuario === idRuta) {
      return true;
    }

    // Responsable: solo puede acceder a perfiles de su centro
    if (idRol === 3) {
      return this.usuarioService.getUserById(idRuta).pipe(
        map(educador => {
          if (educador.id_centro === idCentroResponsable) {
            return true;
          } else {
            this.router.navigate(['/no-autorizado']);
            return false;
          }
        }),
        catchError(err => {
          console.error('Error al obtener educador', err);
          this.router.navigate(['/no-autorizado']);
          return of(false);
        })
      );
    }

    // Deniega el resto de casos
    this.router.navigate(['/no-autorizado']);
    return false;
  }
}