import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from "chart.js";
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  rol: 'admin' | 'responsable' | 'educador' = 'admin';

  userInfo: any = {};
  userEmail: string = '';
  datosUsuario: any = {};
  userPicture: string = '';

  idRol: number  = 0;
  idCentro: number  = 0;

  public userChartData: ChartData = { labels: [], datasets: [] };
  public userChartType: ChartType = 'line'; // puedes cambiar a 'bar', 'pie', 'doughnut', 'line', etc.
  public userChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Fuerza números enteros
          stepSize: 1   // Opcional: define el paso entre ticks
        }
      }

    }
  };

  // public userChartData: ChartData = { labels: [], datasets: [] };
  public formChartType: ChartType = 'line'; // puedes cambiar a 'bar', 'pie', 'doughnut', 'line', etc.
  public formChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Fuerza números enteros
          stepSize: 1   // Opcional: define el paso entre ticks
        }
      }

    }
  };

  // public userChartData: ChartData = { labels: [], datasets: [] };
  public pruebaChartType: ChartType = 'line'; // puedes cambiar a 'bar', 'pie', 'doughnut', 'line', etc.
  public pruebaChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Fuerza números enteros
          stepSize: 1   // Opcional: define el paso entre ticks
        }
      }

    }
  };

  constructor(private menuService: MenuService, private authService: AuthService, private sharedService: SharedService, private router: Router, private roleService: RoleService) {}

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
          this.roleService.setRol(this.rol);
        },
        error: (error) => {
          console.error('Error al obtener datos del usuario:', error);
        }
      });

    } else {
      console.warn('No se pudo obtener información del token.');
    }
    this.loadUserGraph();
  }

  loadUserGraph() {
    this.menuService.getUserByDay().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const fechas = response.data.map((item: any) => item.fecha);
          const cantidades = response.data.map((item: any) => item.cantidad);

          this.userChartData = {
            labels: fechas,
            datasets: [{
              label: 'Usuarios conectados por día',
              data: cantidades,
              fill: true,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3
            }]
          };
        } else {
          console.warn('No se recibieron datos válidos');
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    });
  }
}