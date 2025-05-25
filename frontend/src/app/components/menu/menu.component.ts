import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() rol: 'admin' | 'responsable' | 'educador' = 'admin';
  userInfo: any = {};
  userEmail: string = '';
  datosUsuario: any = {};

  idRol: number  = 0;
  idCentro: number  = 0;

  constructor(private menuService: MenuService, private authService: AuthService, private sharedService: SharedService) {}

  ngOnInit(): void {
  const tokenPayload = this.authService.decodeToken();

  if (tokenPayload) {
    this.userInfo = tokenPayload;
    this.userEmail = this.userInfo.email || '';
    console.log('email:', this.userEmail);

    // Llamamos al servicio para obtener más datos del usuario desde MySQL
    this.menuService.getUserInfo(this.userEmail).subscribe({
      next: (respuesta) => {
        this.datosUsuario = respuesta.data;
        this.idRol = this.datosUsuario.id_rol;
        this.idCentro = this.datosUsuario.id_centro;

        this.sharedService.setIdRol(this.idRol);
        this.sharedService.setIdCentro(this.idCentro);

        switch (this.idRol) {
      case 1:
        this.rol = 'educador';
        break;
      case 2:
        this.rol = 'admin';
        break;
      case 3:
        this.rol = 'responsable';
        break;
    }


        console.log('Datos del usuario:', this.datosUsuario);
        console.log('idRol:', this.idRol);
        console.log('idCentro:', this.idCentro);
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    });

  } else {
    console.warn('No se pudo obtener información del token.');
  }
}

  cambiarRol(nuevoRol: 'admin' | 'responsable' | 'educador'): void {
    this.rol = nuevoRol;
  }

  
}