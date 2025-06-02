import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { SharedService } from 'src/app/services/shared.service';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';

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
        tension: 0.5
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

  constructor(private menuService: MenuService, private authService: AuthService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadChangeRole();
    this.loadUserByDay();
  }

  loadChangeRole() {
    const tokenPayload = this.authService.decodeToken();

    if (tokenPayload) {
      this.userInfo = tokenPayload;
      this.userEmail = this.userInfo.email || '';
      // console.log('email:', this.userEmail);

      // Llamamos al servicio para obtener más datos del usuario desde MySQL
      this.menuService.getUserInfo(this.userEmail).subscribe({
        next: (respuesta) => {
          this.datosUsuario = respuesta.data;
          this.idRol = this.datosUsuario.id_rol;
          this.idCentro = this.datosUsuario.id_centro;

          this.sharedService.setIdRol(this.idRol);
          this.sharedService.setIdCentro(this.idCentro);

          switch (this.idRol) {
            case 1:
              this.rol = 'educador';
              break;
            case 2:
              this.rol = 'admin';
              break;
            case 3:
              this.rol = 'responsable';
              break;
          }


          // console.log('Datos del usuario:', this.datosUsuario);
          // console.log('idRol:', this.idRol);
          // console.log('idCentro:', this.idCentro);
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

  loadUserByDay() {
    this.menuService.getUserByDay().subscribe({
      next: (respuesta) => {
        console.log('Respuesta:', respuesta);
        if (respuesta && respuesta.data) {
          // Asegurarnos de que tenemos exactamente 15 días de datos
          const datos = this.prepararDatosActividad(respuesta.data);
          this.actualizarDatosGrafico(datos);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de actividad:', error);
      }
    });
  }

  prepararDatosActividad(datos: any[]): number[] {
    // Crear un array de 15 días con valores iniciales en 0
    const datosPorDia = new Array(15).fill(0);
    
    // Obtener la fecha de hace 15 días
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 14);

    // Procesar los datos recibidos
    datos.forEach(dato => {
      const fechaDato = new Date(dato.fecha);
      const diasDiferencia = Math.floor((fechaDato.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasDiferencia >= 0 && diasDiferencia < 15) {
        datosPorDia[diasDiferencia] = dato.cantidad;
      }
    });

    return datosPorDia;
  }

  actualizarDatosGrafico(nuevosDatos: number[]) {
    if (nuevosDatos.length === 15) {
      if (this.chartData.datasets && this.chartData.datasets[0]) {
        this.chartData.datasets[0].data = nuevosDatos;
        // Forzar la actualización del gráfico
        this.chartData = { ...this.chartData };
      }
    } else {
      console.error('Los datos deben tener exactamente 15 elementos');
    }
  }

  // Ejemplo de uso con datos aleatorios (puedes reemplazarlo con tus datos reales)
  actualizarConDatosAleatorios() {
    const nuevosDatos = Array.from({length: 15}, () => Math.floor(Math.random() * 100));
    this.actualizarDatosGrafico(nuevosDatos);
  }
}