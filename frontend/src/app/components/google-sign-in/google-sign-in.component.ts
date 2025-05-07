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
  images: string[] = [
   'assets/carrouselLogin/1.jpg',
    'assets/carrouselLogin/2.jpg',
    'assets/carrouselLogin/3.jpg'
  ];
  currentImageIndex = 0;
  constructor(private ngZone: NgZone,
              private authService: AuthService,
              private router: Router,
              private cookieService: CookieService ) { }


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


  initializeGoogleSignIn() {
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

  private loadCarousel() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }
}
