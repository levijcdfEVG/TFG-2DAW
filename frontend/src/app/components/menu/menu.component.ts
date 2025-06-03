import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() rol: 'admin' | 'responsable' | 'educador' = 'admin';

  userInfo: any = {};
  userEmail: string = '';
  datosUsuario: any = {};
  userPicture: string = '';

  idRol: number  = 0;
  idCentro: number  = 0;

  public chartData: ChartData = {
    labels: Array.from({length: 15}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (14 - i));
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }),
    datasets: [
      {
        data: Array(15).fill(0), // Inicializamos con ceros
        label: 'Actividad',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
        tension: 0.1
      }
    ]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public chartType: ChartType = 'line'; // puedes cambiar a 'bar', 'pie', 'doughnut', 'line', etc.

  constructor(private menuService: MenuService, private authService: AuthService, private sharedService: SharedService, private router: Router) {}

  ngOnInit(): void {
    const tokenPayload = this.authService.decodeToken();

    if (tokenPayload) {
      this.userInfo = tokenPayload;
      this.userEmail = this.userInfo.email || '';
      this.userPicture = this.userInfo.picture || '';
      // console.log('email:', this.userEmail);
      // console.log('picture:', this.userPicture);

      // Llamamos al servicio para obtener más datos del usuario desde MySQL
      this.menuService.getUserInfo(this.userEmail).subscribe({
        next: (respuesta) => {
          this.datosUsuario = respuesta.data;
          // console.log('Datos del usuario desde MySQL:', this.datosUsuario);
          this.idRol = this.datosUsuario.id_rol;
          this.idCentro = this.datosUsuario.id_centro;

          this.sharedService.setIdRol(this.idRol);
          this.sharedService.setIdCentro(this.idCentro);
          this.sharedService.setIdUsuario(this.datosUsuario.id);

          // console.log('idRol en sharedService:', this.sharedService.getIdRol());
          // console.log('idCentro en sharedService:', this.sharedService.getIdCentro());
          // console.log('idUsuario en sharedService:', this.sharedService.getIdUsuario());

          switch (this.idRol) {
            case 1:
              this.rol = 'educador';
              this.router.navigate(['/usuarios', this.datosUsuario.id]);
              break;
            case 2:
              this.rol = 'admin';
              break;
            case 3:
              this.rol = 'responsable';
              break;
          }
        },
        error: (error) => {
          console.error('Error al obtener datos del usuario:', error);
        }
      });

    } else {
      console.warn('No se pudo obtener información del token.');
    }
  }

  cambiarRol(nuevoRol: 'admin' | 'responsable' | 'educador'): void {
    this.rol = nuevoRol;
  }
}