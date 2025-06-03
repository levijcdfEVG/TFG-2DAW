import { Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  logoPath = 'assets/logotipo.png';

  // RRSS
  facebook = 'https://www.facebook.com/EscuelaVirgendeGuadalupe/';
  twitter_X = 'https://x.com/i/flow/login?redirect_after_login=%2Fescuelaevg';
  instagram = 'https://www.instagram.com/escuelaevg/?hl=es';
  youtube = 'https://www.youtube.com/user/VirgenDeGuadalupeTV';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
