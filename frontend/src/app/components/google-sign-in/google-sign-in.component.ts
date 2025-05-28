import {Component, NgZone, OnInit} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {googleID} from "../../config/config";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal2 from "sweetalert2";
import {CookieService} from "ngx-cookie-service";
import {ToastrService} from "ngx-toastr";
import { environment } from "../../../environments/environment.prod";

declare const google: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit {
  images: string[] = [
   'assets/carrouselLogin/1.jpg',
    'assets/carrouselLogin/2.jpg',
    'assets/carrouselLogin/3.jpg'
  ];
  currentImageIndex = 0;
  constructor(private ngZone: NgZone,
              private authService: AuthService,
              private router: Router,
              private cookieService: CookieService,
              private toastr: ToastrService) { }


  /**
   * Carga el carusel y verifica si hay un token de autenticación
   * válido en las cookies. Si lo hay, redirige a /info-centros.
   * Si no lo hay, muestra el botón de inicio de sesión con Google.
   */
  ngOnInit(): void {
    this.loadCarousel();
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      this.authService.setAuthState(true);
      this.router.navigate(['/info-centros']);
      return;
    }
    // Mostrar botón de login si no hay token válido
    this.loadGoogleScript().then(() => {
      this.initializeGoogleSignIn();
    });
  }


  /**
   * Inicializa el botón de inicio de sesión con Google (GSI).
   *
   * Este método inicializa el botón de GSI con el identificador de cliente y una
   * función de callback. La función de callback se llama cuando el usuario hace clic
   * en el botón de GSI y se autentica con Google.
   *
   * El método también renderiza el botón de GSI con un tema y tamaño personalizados.
   * El tema se establece en 'outline' y el tamaño se establece en 'large'.
   *
   * Además, el método muestra el diálogo de inicio de sesión de un solo toque, que
   * permite al usuario iniciar sesión con un solo clic.
   */
  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleId,
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }  // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  /**
   * Maneja la respuesta recibida de Google Sign-In.
   *
   * Este método toma la respuesta del proceso de inicio de sesión de Google y verifica
   * si hay cuentas existentes utilizando el `authService`. Si la verificación de la cuenta
   * tiene éxito, muestra un mensaje de éxito, establece el estado de autenticación,
   * guarda el token en cookies y navega a la ruta '/info-centros'. Si la verificación de la
   * cuenta falla, muestra un mensaje de error con el motivo del fallo.
   *
   * @param response - El objeto de respuesta recibido de Google Sign-In que contiene la credencial.
   */
  handleCredentialResponse(response: any) {
    this.authService.checkExistingAccounts(response.credential).subscribe(res => {
      if (res.success) {
        this.toastr.success("Inicio de sesión exitoso", "Login de Google", {
          positionClass: "toast-bottom-right"
        });
        this.cookieService.set('token', res.token, 1, '/');
        this.ngZone.run(() => {
          this.authService.setAuthState(true);
          this.router.navigate(['/menu']); 
        });
      }else{
        Swal2.fire({
          icon: 'error',
          title: 'Inicio de sesión fallido',
          html: res.error + '<br>Entre en contacto con el administrador',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  /**
   * Carga dinámicamente el script del cliente de Google para inicio de sesión con Google.
   *
   * Si el script no está cargado, crea una nueva etiqueta de script y la agrega al head del
   * documento. Establece el evento onload del script para resolver la promesa cuando el
   * script termine de cargar. Si el script ya está cargado, la promesa se resuelve
   * inmediatamente.
   *
   * @returns {Promise<void>} Una promesa que se cumple cuando el script se carga.
   */

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('google-client-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.id = 'google-client-script';
        script.onload = () => {
          resolve();
        };
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  /**
   * Realiza un ciclo automático a través de las imágenes en el carrusel.
   *
   * Este método actualiza el índice `currentImageIndex` a intervalos regulares,
   * lo que hace que la imagen mostrada en el carrusel cambie cada 5 segundos.
   */
  private loadCarousel() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }
}
