import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  rol: 'admin' | 'responsable' | 'educador' = 'educador';

  logoPath: string = 'assets/logotipo.png';

  // RRSS y EVG
  facebook: string = 'https://www.facebook.com/EscuelaVirgendeGuadalupe/';
  twitter_X: string = 'https://x.com/i/flow/login?redirect_after_login=%2Fescuelaevg';
  instagram: string = 'https://www.instagram.com/escuelaevg/?hl=es';
  youtube: string = 'https://www.youtube.com/user/VirgenDeGuadalupeTV';
  intranet: string = "https://www.fundacionloyola.es/brocal/v2/index.php";
  evg: string = "https://fundacionloyola.com/vguadalupe/"

  constructor(private authService: AuthService, private router: Router, private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleService.rol$.subscribe(rol => {
      this.rol = rol;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
