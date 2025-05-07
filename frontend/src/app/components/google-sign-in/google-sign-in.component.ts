import {Component, NgZone, OnInit} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {googleID} from "../../config/config";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal2 from "sweetalert2";
import {CookieService} from "ngx-cookie-service";

declare const google: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit {
  // private form: FormGroup;
  constructor(private ngZone: NgZone,
              private authService: AuthService,
              private router: Router,
              private cookieService: CookieService ) { }


  ngOnInit(): void {
    // Comprobar si el usuario ya está autenticado
    if (this.authService.isLoggedIn()) {
      // Si ya está logueado, redirige a la página protegida
      this.router.navigate(['/info-centros']);
    } else {
      // Si no está logueado, carga el script de Google y muestra el botón de inicio de sesión
      this.loadGoogleScript().then(() => {
        this.initializeGoogleSignIn();
      });
    }
  }


  // private loadFormCamps() {
  //   this.form = this.formBuilder.group({
  //     email: [''],
  //     password: ['']
  //   })
  // }


  initializeGoogleSignIn() {
    console.log('google.accounts:', google?.accounts);
    google.accounts.id.initialize({
      client_id: googleID,
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }  // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  handleCredentialResponse(response: any) {
    this.authService.checkExistingAccounts(response.credential).subscribe(res => {
      if (res.success) {
        Swal2.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500
        })
        this.cookieService.set('token', res.token, 1, '/');
        this.ngZone.run(() => {
          this.authService.setAuthState(true);
          this.router.navigate(['/info-centros']);
        });
      }
    });
  }

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

}
