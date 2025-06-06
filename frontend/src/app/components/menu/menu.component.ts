import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ChartData, ChartDataset, ChartOptions, ChartType } from "chart.js";
import { RoleService } from 'src/app/services/role.service';
import { FormacionService } from "../../services/formacion.service";

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

  public formChartData: ChartData = { labels: [], datasets: [] };
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

  public centerChartData: ChartData = { labels: [], datasets: [] };
  public centerChartType: ChartType = 'bar'; // puedes cambiar a 'bar', 'pie', 'doughnut', 'line', etc.
  public centerChartOptions: ChartOptions = {
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

  constructor(private menuService: MenuService,
              private roleService: RoleService,
              private authService: AuthService,
              private sharedService: SharedService,
              private router: Router) {}

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
    this.loadFormGraph();
    this.loadCenterGraph();
  }

  loadUserGraph() {
    this.menuService.getUserByDay().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const totalSesiones = response.data.totalSesiones;    // Sesiones totales por día
          const sesionesPorRol = response.data.sesionesPorRol;  // Sesiones por rol y día

          // Procesar datos para el gráfico
          const fechas = totalSesiones.map((item: { fecha: string }) => item.fecha);
          const totales = totalSesiones.map((item: { cantidad: number }) => item.cantidad);

          // Procesar datos por rol
          const roles = Array.from(new Set(sesionesPorRol.map((item: { nombre_rol: string }) => item.nombre_rol))) as string[]; // Obtiene una lista unica de roles
          const datasets = roles.map((rol: string) => {
            const datos = fechas.map((fecha: string) => {
              const registro = sesionesPorRol.find((item: { fecha: string; nombre_rol: string }) => 
                item.fecha === fecha && item.nombre_rol === rol
              );
              return registro ? registro.cantidad : 0;
            });
            return {
              label: rol,
              data: datos,
              fill: false,
              type: 'line' as const
            } as ChartDataset<'line', number[]>;
          });

          // Añadir el dataset de totales
          datasets.unshift({
            label: 'Total Sesiones',
            data: totales,
            fill: false,
            type: 'line' as const
          } as ChartDataset<'line', number[]>);

          this.userChartData = {
            labels: fechas,
            datasets: datasets
          };
        } else {
          console.warn('No se recibieron datos válidos');
        }
      },
      error: (error) => {
        console.error('Error al obtener datos de sesiones:', error);
      }
    });
  }

  loadFormGraph() {
    this.menuService.getFormationActiveByMonth().subscribe({
      next: (response) => {
        if (response) {
          const meses = response.data.map((item: any) => {
            const [year, month] = item.mes.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
          });
          const cantidades = response.data.map((item: any) => item.cantidad);

          // Definimos los colores y estilos para el gráfico
          const chartColors = {
            borderColor: 'rgb(75, 192, 192)',      // Verde azulado
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 192, 192)'
          };

          this.formChartData = {
            labels: meses,
            datasets: [{
              label: 'Formaciones activas por mes',
              data: cantidades,
              fill: true,
              type: 'line' as const,
              ...chartColors,
              pointRadius: 5,
              pointHoverRadius: 8,
              borderWidth: 2,
              tension: 0.3
            }]
          };

          // Actualizamos las opciones del gráfico
          this.formChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#666',
                  font: {
                    size: 12
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  precision: 0,
                  stepSize: 1,
                  color: '#666'
                }
              },
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  color: '#666'
                }
              }
            }
          };
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos de formaciones:', error);
      }
    });
  }

  loadCenterGraph() {
    this.menuService.getUserByCenter().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Procesar los datos para el gráfico
          const labels = response.data.map((item: any) => item.nombre_centro);
          const data = response.data.map((item: any) => item.total_usuarios);
  
          this.centerChartData = {
            labels: labels,
            datasets: [
              {
                label: 'Total Usuarios',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
              }
            ]
          };
        } else {
          console.warn('No se recibieron datos válidos para el gráfico de centros');
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos de centros:', error);
      }
    });
  }
}