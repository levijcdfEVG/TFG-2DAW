import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService, public router: Router) {}

  rolSimulado: 'admin' | 'responsable' | 'educador' = 'educador';

  mostrarMenu(): boolean {
    return this.router.url.startsWith('/menu'); // o más rutas protegidas
  }

}