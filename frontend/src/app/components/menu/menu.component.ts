import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  
  /**
   * Rol del usuario. Puede ser 'admin', 'responsable' o 'educador'.
   * Se puede establecer desde el componente padre si es necesario.
   */
  @Input() rol: 'admin' | 'responsable' | 'educador' = 'admin';
  
  /**
   * Información básica decodificada del token JWT.
   */
  userInfo: any = {};

  /**
   * Correo electrónico del usuario autenticado.
   */
  userEmail: string = '';

  /**
   * Información detallada del usuario desde la base de datos.
   */
  datosUsuario: any = {};

  /**
   * URL de la imagen de perfil del usuario (si está disponible).
   */
  userPicture: string = '';

  /**
   * ID del rol del usuario obtenido desde la base de datos.
   */
  idRol: number  = 0;

  /**
   * ID del centro asociado al usuario.
   */
  idCentro: number  = 0;

   /**
   * Inyecta los servicios necesarios para el menú.
   * @param menuService Servicio que obtiene información adicional del usuario desde MySQL.
   * @param authService Servicio de autenticación que maneja el token.
   * @param sharedService Servicio compartido para almacenar datos globales del usuario.
   * @param router Servicio de rutas para navegación dinámica.
   */
  constructor(private menuService: MenuService, private authService: AuthService, private sharedService: SharedService, private router: Router) {}

  /**
   * Inicializa el componente. Decodifica el token JWT y obtiene la información del usuario
   * desde el backend, luego guarda esa información en el SharedService y redirige según el rol.
   */
  ngOnInit(): void {
  const tokenPayload = this.authService.decodeToken();

  if (tokenPayload) {
    this.userInfo = tokenPayload;
    this.userEmail = this.userInfo.email || '';
    this.userPicture = this.userInfo.picture || '';
    console.log('email:', this.userEmail);
    console.log('picture:', this.userPicture);

    // Llamada al backend para obtener los datos del usuario. Buscamos por email.
    this.menuService.getUserInfo(this.userEmail).subscribe({
      next: (respuesta) => {
        this.datosUsuario = respuesta.data;
        console.log('Datos del usuario desde MySQL:', this.datosUsuario);
        this.idRol = this.datosUsuario.id_rol;
        this.idCentro = this.datosUsuario.id_centro;

        // Guarda los datos en SharedService para uso global
        this.sharedService.setIdRol(this.idRol);
        this.sharedService.setIdCentro(this.idCentro);
        this.sharedService.setIdUsuario(this.datosUsuario.id);

        console.log('idRol en sharedService:', this.sharedService.getIdRol());
        console.log('idCentro en sharedService:', this.sharedService.getIdCentro());
        console.log('idUsuario en sharedService:', this.sharedService.getIdUsuario());

        // Según el rol mostramos el menú correspondiente 
        switch (this.idRol) {
          case 1:
            this.rol = 'educador';
            this.router.navigate(['/info-educadores', this.datosUsuario.id]);
            break;
          case 2:
            this.rol = 'admin';
            break;
          case 3:
            this.rol = 'responsable';
            break;
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    });

  } else {
    console.warn('No se pudo obtener información del token.');
  }
}
}