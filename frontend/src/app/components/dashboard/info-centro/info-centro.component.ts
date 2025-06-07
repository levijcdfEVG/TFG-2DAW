import {ChangeDetectorRef, Component, OnInit, NgZone} from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import Swal2 from 'sweetalert2';
import * as $ from "jquery";


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
   * @param ngZone Servicio para ejecutar código dentro de la zona de Angular
   */
  constructor(private centrosService: CentrosService, private toastr: ToastrService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

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
        this.loadDataTable();
      } else {
        this.mensaje = 'No existen centros registrados. Dar de alta uno nuevo.';
      }
    });
  }

// METODOS DE LA TABLA -----------------------------------

  loadDataTable() {
    setTimeout(() => {
      const table = $('#centerTable').DataTable({
        data: this.dataSource,
        processing: true,
        autoWidth: false,
        pageLength: 6,
        searching: false,
        ordering: false,
        lengthChange: false,
        pagingType: 'simple_numbers',
        language: {
          lengthMenu: "Mostrar _MENU_ entradas",
          info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
          infoEmpty: 'Mostrando 0 a 0 de 0 entradas',
          paginate: {
            first: "",
            previous: " <i class='fas fa-chevron-left'></i> Anterior",
            next: "Siguiente <i class='fas fa-chevron-right'></i>",
            last: ""
          }
        },
        columns: [{
          data: 'nombre_centro',
          className: 'ps-4',
        //
        // <i class="fas fa-map-marker-alt text-theme me-2"></i>
          render: (data: any, type: any, row: any) => {
            return ` <a class="text-decoration-none text-detalles fw-medium" href="${row.url}" target="_blank">
                        <i class="fas fa-building text-theme me-2"></i>
                        ${row.nombre_centro}
                      </a>
                      
            `
          }
        },{
          data: 'direccion_centro',
          className: 'text-start',
          render: (data: any, type: any, row: any) => {
            return `<i class="fas fa-map-marker-alt text-theme me-2"></i>${row.direccion_centro}`
          }
        },{
          data: 'correo_centro',
          render: (data: any, type: any, row: any) => {
            return `<i class="fas fa-envelope text-theme me-2"></i>${row.correo_centro}`
          }
        },{
          data: 'telefono_centro',
          render: (data: any, type: any, row: any) => {
            return `<i class="fas fa-phone text-theme me-2"></i>${row.telefono_centro}`
          }
        },{
          data: 'cp',
          className: 'text-end',
        },{
          data: 'nombre_localidad',
        },{
          data: 'null',
          className: 'text-center',
          render: (data: any, type: any, row: any) => `
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-warning btn-sm btn-modificar">Modificar</button>
              <button class="btn btn-danger btn-sm btn-borrar">Borrar</button>
            </div>
          `
        }]
      });

      $('#centerTable tbody').on('click', 'button', (event) => {
        const $btn = $(event.currentTarget);
        const rowData = table.row($btn.closest('tr')).data();

        this.ngZone.run(() => {
          if ($btn.hasClass('btn-modificar')) {
            this.modificarRegistro(rowData);
          } else if ($btn.hasClass('btn-borrar')) {
            this.borrarRegistro(rowData);
          }
        });
      });
    }, 100);
  }
}

