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

  logoPath = 'assets/logotipo.png';

  // RRSS
  facebook = 'https://www.facebook.com/EscuelaVirgendeGuadalupe/';
  twitter_X = 'https://x.com/i/flow/login?redirect_after_login=%2Fescuelaevg';
  instagram = 'https://www.instagram.com/escuelaevg/?hl=es';
  youtube = 'https://www.youtube.com/user/VirgenDeGuadalupeTV';

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
