import {Component, NgZone, OnInit} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {googleID} from "../../config/config";
import {FormBuilder, FormGroup} from "@angular/forms";

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
              private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    // this.loadFormCamps();
    this.loadGoogleScript().then(() => {
      this.initializeGoogleSignIn();
    });
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
    const token = response.credential;
    const decoded: any = jwtDecode(token);
    // Extract user information
    const user = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };

    console.log('User:', user);

    this.ngZone.run(() => {
      this.authService.setAuthState(true);
      // Navigate to a protected route, e.g.,
       this.router.navigate(['/info-centros']);
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
