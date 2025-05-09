import { Component, OnInit } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-info-centro',
  templateUrl: './info-centro.component.html',
  styleUrls: ['./info-centro.component.css']
})
export class InfoCentroComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre_centro',
    'direccion_centro',
    'cp',
    'correo_centro',
    'telefono_centro',
    'nombre_localidad'
  ];
  dataSource: any[] = [];

  nuevoCentro: any = {
    nombre_centro: '',
    direccion_centro: '',
    cp: '',
    nombre_localidad: '',
    telefono_centro: '',
    correo_centro: ''
  };
  mensaje: string = '';
  centroSeleccionado: any = {};

  constructor(private centrosService: CentrosService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data;
      } else {
        //console.error(response.message);
        this.mensaje = 'No existen centros registrados. Dar de alta uno nuevo.';
      }
    });

    this.centrosService.centrosActualizados$.subscribe(() => {
      this.actualizarTabla();
    });
    this.actualizarTabla();
  }

  actualizarTabla(): void {
    this.centrosService.getCentros().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource = response.data; // Actualizar los datos de la tabla
        } else {
          this.toastr.error('Error al recargar los centros: ' + response.message, 'Error');
        }
      },
      error: () => {
        this.toastr.error('Error en la solicitud HTTP al recargar los centros.', 'Error');
      }
    });
  }

  modificarRegistro(element: any): void {
    this.centroSeleccionado = { ...element }; // Copiar los datos del registro seleccionado
    const modal = document.getElementById('modificarCentroModal');
    if (modal) {
      // Ensure Bootstrap is imported and available
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show(); // Mostrar el modal
    }
  }
  
  borrarRegistro(element: any): void {
    const confirmacion = confirm(`¿Estás seguro de que deseas borrar el registro de ${element.nombre_centro}?`);
    if (confirmacion) {
      this.centrosService.eliminarCentro(element.correo_centro).subscribe(response => {
        if (response.success) {
          this.dataSource = this.dataSource.filter(item => item.correo_centro !== element.correo_centro);
          this.toastr.success('Centro eliminado correctamente.', 'Éxito');
        } else {
          this.toastr.error('Error al eliminar el centro: ' + response.message, 'Error');
        }
      }, error => {
        this.toastr.error('Error al comunicarse con el servidor.', 'Error');
      });
    }
  }

  
}
