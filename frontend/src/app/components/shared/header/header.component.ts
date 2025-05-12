import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  logoPath = 'assets/logotipo.png';

  // RRSS
  facebook = 'https://www.facebook.com';
  twitter_X = 'https://www.twitter.com';
  instagram = 'https://www.instagram.com';
  youtube = 'https://www.youtube.com';

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
