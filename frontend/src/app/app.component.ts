import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    private sharedService: SharedService
  ) {}
  constructor(public authService: AuthService, public router: Router, private cdRef: ChangeDetectorRef) {}

  rolSimulado: 'admin' | 'responsable' | 'educador' = 'educador';
  mostrarBotonVolver: boolean = false;


  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state;
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
const url = event.url;
        const idRol = this.sharedService.getIdRol();

        // Ocultar en rutas específicas
        const rutasSinBoton = ['/menu', '/no-autorizado'];

        const esRutaInfoCentros = /^\/info-educadores\/\d+$/.test(url);
        const debeOcultarse = rutasSinBoton.includes(url) || (esRutaInfoCentros && idRol === 1);

        this.mostrarBotonVolver = !debeOcultarse;
      });
  }

  volverAlMenu(): void {
    this.router.navigate(['/menu']);
  }

  mostrarMenu(): boolean {
    return this.router.url.startsWith('/menu');
  }
}