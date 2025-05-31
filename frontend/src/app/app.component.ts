import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router, private cdRef: ChangeDetectorRef) {}

  rolSimulado: 'admin' | 'responsable' | 'educador' = 'educador';
  mostrarBotonVolver: boolean = false;


  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.mostrarBotonVolver = event.url !== '/menu';
        this.cdRef.detectChanges();
      });
  }

  volverAlMenu(): void {
    this.router.navigate(['/menu']);
  }

  mostrarMenu(): boolean {
    return this.router.url.startsWith('/menu');
  }
}