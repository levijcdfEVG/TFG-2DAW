import {Component, NgZone, OnInit} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {googleID} from "../../config/config";

declare const google: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit {
  constructor(private ngZone: NgZone, private authService: AuthService, private router: Router ) { }


  ngOnInit(): void {
    this.initializeGoogleSignIn();
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
    const token = response.credential;
    const decoded: any = jwtDecode(token);
    console.log(decoded);

    // Extract user information
    const user = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };

    this.ngZone.run(() => {
      this.authService.setAuthState(true);
      // Navigate to a protected route, e.g.,
       this.router.navigate(['/info-centros']);
    });
  }
}
