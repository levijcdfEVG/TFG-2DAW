import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormacionService } from '../../../services/formacion.service'; // Ajusta la ruta si es distinta
import { ChangeDetectorRef } from '@angular/core';
import {Formacion} from "../../../services/interfaces/formacionesResponse";
import {ToastrService} from "ngx-toastr";
import Swal2 from "sweetalert2";
import * as $ from 'jquery';
import 'datatables.net'; // Núcleo
import 'datatables.net-bs5'; // Estilo



@Component({
  selector: 'app-info-sdsda',
  templateUrl: './info-formacion.component.html',
  styleUrls: ['./info-formacion.component.css']
})
export class InfoFormacionComponent implements OnInit{

  public formaciones: any[] = [];
  protected formacionSeleccionada: any = null;

  constructor(
      private formacionService: FormacionService,
      private cdr: ChangeDetectorRef,
      private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchFormaciones();
  }

  protected fetchFormaciones() {
    this.formacionService.getAllFormaciones().subscribe(response => {
      if (response.success) {
        this.formaciones = response.data;
        console.log(this.formaciones);
        this.cdr.detectChanges();

        // Esperamos a que Angular pinte la tabla antes de aplicar DataTables
        setTimeout(() => {
          const table: any = $('#formaciones');
          if ($.fn.dataTable.isDataTable(table)) {
            table.DataTable().destroy(); // por si ya se había inicializado
          }
          table.DataTable({
            language: {
              lengthMenu: 'Mostrar _MENU_ registros',
              zeroRecords: 'No se encontraron resultados',
              info: 'Mostrando del _START_ al _END_ de _TOTAL_ registros',
              infoEmpty: 'Mostrando 0 registros',
              infoFiltered: '(filtrado de _MAX_ registros totales)',
              search: 'Buscar:',
              paginate: {
                first: 'Primero',
                last: 'Último',
                next: 'Siguiente',
                previous: 'Anterior'
              }
            }
          });
        }, 0);
      }
    });
  }


  protected editarFormacion(formacion: any) {
    this.formacionService.setFormacionAEditar(formacion);
    this.cdr.detectChanges();
  }

  protected borrarFormacion(f: Formacion) {
    let id = f.id;

    Swal2.fire({
      title: '¿Estás seguro?',
      text: "La formación será desactivada",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formacionService.desactivarFormacion(id).subscribe(response => {
          if (response.success) {
            this.toastr.success("Formación desactivada exitosamente", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
            this.fetchFormaciones();
          } else {
            this.toastr.error("Error al desactivar la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        });
      }
    });
  }

  mostrarInformacionCompleta(f: any) {
    // Construimos listas en HTML para los arrays
    const modulosHtml = f.modulos && f.modulos.length > 0
        //@ts-ignore
        ? `${f.modulos.map(m => `${m}`).join('')}`
        : 'No hay módulos';
    const objetivosHtml = f.objetivos && f.objetivos.length > 0
        //@ts-ignore
        ? `${f.objetivos.map(o => `${o}`).join('')}`
        : 'No hay objetivos';
    const cursosHtml = f.cursos && f.cursos.length > 0
        //@ts-ignore
        ? `${f.cursos.map(c => `${c}`).join('')}`
        : 'No hay cursos';

    // Centro puede ser null o undefined, por eso chequeamos
    const centroHtml = f.centro
        ? `<p><strong>Centro:</strong> ${f.centro.nombre} (ID: ${f.centro.id})</p>`
        : 'No hay centro asignado';

    // Construimos contenido HTML completo
    const contenido = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        font-size: 14px;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        vertical-align: top;
      }
      th {
        background-color: #f2f2f2;
        text-align: left;
        width: 150px;
      }
      ul {
        margin: 0;
        padding-left: 18px;
      }
    </style>

    <table>
      <tr><th>Id</th><td>${f.id}</td></tr>
      <tr><th>Lugar de impartición</th><td>${f.lugar_imparticion}</td></tr>
      <tr><th>Duración</th><td>${f.duracion} horas</td></tr>
      <tr><th>Modalidad</th><td>${f.modalidad}</td></tr>
      <tr><th>Justificación</th><td>${f.justificacion}</td></tr>
      <tr><th>Metodología</th><td>${f.metodologia}</td></tr>
      <tr><th>Docentes</th><td>${f.docentes}</td></tr>
      <tr><th>Dirigido a</th><td>${f.dirigido_a}</td></tr>
      <tr><th>Módulos</th><td>${modulosHtml}</td></tr>
      <tr><th>Objetivos</th><td>${objetivosHtml}</td></tr>
      <tr><th>Cursos</th><td>${cursosHtml}</td></tr>
      <tr><th>Centro</th><td>${centroHtml}</td></tr>
    </table>
  `;

    Swal2.fire({
      title: 'Información completa',
      html: contenido,
      width: '600px',
      confirmButtonText: 'Cerrar'
    });
  }

}
