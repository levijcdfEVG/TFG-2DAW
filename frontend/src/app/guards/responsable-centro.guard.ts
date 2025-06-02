import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsableCentroGuard implements CanActivate {

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private usuarioService: UsuarioService 
  ) {}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const idRol = this.sharedService.getIdRol();
    const idCentroResponsable = this.sharedService.getIdCentro();
    const idUsuario = this.sharedService.getIdUsuario(); 
    const idRuta = +route.params['id']; 

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

    // ❌ Todos los demás: denegado
    this.router.navigate(['/no-autorizado']);
    return false;
  }
}