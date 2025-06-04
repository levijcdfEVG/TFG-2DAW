import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import Swal2 from 'sweetalert2';


@Component({
  selector: 'app-info-centro',
  templateUrl: './info-centro.component.html',
  styleUrls: ['./info-centro.component.css']
})
export class InfoCentroComponent implements OnInit {

   /**
   * Columnas visibles en la tabla de centros.
   */

  displayedColumns: string[] = [
    'nombre_centro',
    'direccion_centro',
    'cp',
    'correo_centro',
    'telefono_centro',
    'nombre_localidad'
  ];

  /**
   * Fuente de datos para la tabla.
   */
  dataSource: any[] = [];

  /**
   * Objeto para registrar un nuevo centro.
   */
  nuevoCentro: any = {
    nombre_centro: '',
    direccion_centro: '',
    cp: '',
    nombre_localidad: '',
    telefono_centro: '',
    correo_centro: ''
  };

  /**
   * Mensaje informativo que se muestra si no hay resultados.
   */
  mensaje: string = '';

   /**
   * Centro seleccionado para modificar.
   */
  centroSeleccionado: any = {};

   /**
   * Centro marcado para ser eliminado.
   */
  centroAEliminar: any = null;

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param centrosService Servicio para acceder a datos de centros.
   * @param toastr Servicio para mostrar notificaciones.
   * @param cdr Servicio para detectar cambios manuales.
   */
  constructor(private centrosService: CentrosService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {}

  /**
   * Hook de inicialización. Carga la lista de centros al inicio.
   */
  ngOnInit(): void {
    this.getCentros();
  }

  /**
   * Abre el modal para modificar un centro existente.
   * @param element registro seleccionado de la tabla.
   */
  modificarRegistro(element: any): void {
    this.centroSeleccionado = { ...element }; 
    const modal = document.getElementById('modificarCentroModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show(); 
    }
  }
  
  /**
   * Solicita confirmación y elimina un centro si el usuario acepta.
   * @param element registro a eliminar.
   */
  borrarRegistro(element: any): void {
    this.centroAEliminar = element; 
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
          this.centroAEliminar = null;
        }, error => {
          this.toastr.error('Error al comunicarse con el servidor.', 'Error');
          this.centroAEliminar = null; 
        });
      }
    });
  }

  /**
   * Refresca la lista de centros. Se puede usar desde eventos externos.
   * @param event Evento recibido desde el componente hijo.
   */
  refreshLista(event: any): void {
    this.getCentros();
    this.cdr.detectChanges();
  }

  /**
   * Carga todos los centros desde el servicio.
   * Muestra mensaje si no hay resultados.
   */
  private getCentros(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data;
      } else {
        this.mensaje = 'No existen centros registrados. Dar de alta uno nuevo.';
      }
    });
  }

}

