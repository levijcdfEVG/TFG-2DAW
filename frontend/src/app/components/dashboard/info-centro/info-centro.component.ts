import { Component, OnInit } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import Swal2 from 'sweetalert2';


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
  centroAEliminar: any = null;

  constructor(private centrosService: CentrosService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data;
      } else {
        this.mensaje = 'No existen centros registrados. Dar de alta uno nuevo.';
      }
    });
  }

  modificarRegistro(element: any): void {
    this.centroSeleccionado = { ...element }; // Copiar los datos del registro seleccionado
    const modal = document.getElementById('modificarCentroModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show(); // Mostrar el modal
    }
  }
  
  borrarRegistro(element: any): void {
    this.centroAEliminar = element; // Guarda el centro que se desea eliminar
    Swal2.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.centrosService.eliminarCentro(this.centroAEliminar.correo_centro).subscribe(response => {
          if (response.success) {
            this.dataSource = this.dataSource.filter(item => item.correo_centro !== this.centroAEliminar.correo_centro);
            this.toastr.success('Centro eliminado correctamente.', 'Éxito');
          } else {
            this.toastr.error('Error al eliminar el centro: ' + response.message, 'Error');
          }
          this.centroAEliminar = null; // Limpia la variable
        }, error => {
          this.toastr.error('Error al comunicarse con el servidor.', 'Error');
          this.centroAEliminar = null; // Limpia la variable
        });
      }
    });
  }
}

