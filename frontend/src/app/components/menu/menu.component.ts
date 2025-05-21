import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() rol: 'admin' | 'responsable' | 'educador' = 'admin';
  userInfo: any;
  userEmail: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const tokenPayload = this.authService.decodeToken();
    if (tokenPayload) {
      this.userInfo = tokenPayload;
      console.log('Información del usuario:', this.userInfo);
      this.userEmail = this.userInfo.email || '';

      // Si el rol viene en el token, puedes asignarlo dinámicamente
      if (this.userInfo.rol) {
        this.rol = this.userInfo.rol;
      }
    } else {
      console.warn('No se pudo obtener información del token.');
    }
  }

  cambiarRol(nuevoRol: 'admin' | 'responsable' | 'educador'): void {
    this.rol = nuevoRol;
  }

  
}