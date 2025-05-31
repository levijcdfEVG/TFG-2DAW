/**
 * @fileoverview Componente InfoFormacionComponent para visualizar, editar y eliminar formaciones.
 * Utiliza jQuery y DataTables para renderizar la tabla.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormacionService } from '../../../services/formacion.service';
import { ChangeDetectorRef } from '@angular/core';
import { Formacion } from "../../../services/interfaces/formacionesResponse";
import { ToastrService } from "ngx-toastr";
import Swal2 from "sweetalert2";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-sdsda',
  templateUrl: './info-formacion.component.html',
  styleUrls: ['./info-formacion.component.css']
})
export class InfoFormacionComponent implements OnInit {

  /** Lista de formaciones obtenidas del backend */
  public formaciones: any[] = [];

  /** Formación seleccionada para editar */
  protected formacionSeleccionada: any = null;

  protected noFormations: boolean = false;

  constructor(
      private formacionService: FormacionService,
      private cdr: ChangeDetectorRef,
      private toastr: ToastrService,
      private router: Router
  ) { }

  /**
   * Hook del ciclo de vida de Angular.
   * Se ejecuta al iniciar el componente.
   */
  ngOnInit() {
    this.fetchFormaciones();
  }

  /**
   * Obtiene todas las formaciones desde el backend y actualiza la tabla.
   */
  protected fetchFormaciones() {
    const table: any = $('#formaciones');
    if ($.fn.dataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    this.formacionService.getAllFormaciones().subscribe(response => {
      if (response.success) {
        this.formaciones = response.data;
        this.cdr.detectChanges();
        this.renderTableRows();
        this.bindEvents();

        setTimeout(() => {
          $('#formaciones').DataTable({
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
        }, 100);
      }else{
        this.toastr.error("No hay formaciones registradas. Añada formaciones", "CRUD Formaciones", {
          positionClass: "toast-bottom-right"
        });
        this.noFormations = true;
      }
    });
  }

  /**
   * Establece la formación a editar.
   * @param formacion La formación seleccionada.
   */
  protected editarFormacion(formacion: any) {
    this.formacionService.setFormacionAEditar(formacion);
    this.cdr.detectChanges();
  }

  /**
   * Lanza un diálogo de confirmación para desactivar una formación.
   * @param f La formación a desactivar.
   */
  protected borrarFormacion(f: Formacion) {
    const id = f.id;

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

  /**
   * Muestra un cuadro de diálogo con información detallada de la formación.
   * @param f La formación seleccionada.
   */
  public mostrarInformacionCompleta(f: any) {
    const modulosHtml = f.modulos && f.modulos.length > 0
        // @ts-ignore
        ? `<ul>${f.modulos.map(m => `<li>${m}</li>`).join('')}</ul>`
        : 'No hay módulos';

    const objetivosHtml = f.objetivos && f.objetivos.length > 0
        // @ts-ignore
        ? `<ul>${f.objetivos.map(o => `<li>${o}</li>`).join('')}</ul>`
        : 'No hay objetivos';

    const cursosHtml = f.cursos && f.cursos.length > 0
        // @ts-ignore
        ? `${f.cursos.map(c => `${c}`).join('<br>')}`
        : 'No hay cursos';

    const centroHtml = f.centro
        ? `<p><strong>Centro:</strong> ${f.centro.nombre} (ID: ${f.centro.id})</p>`
        : 'No hay centro asignado';

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
      width: '1400px',
      confirmButtonText: 'Cerrar'
    });
  }


  /**
   * Renderiza las filas de la tabla de formaciones con los botones de acción.
   */
  private renderTableRows() {
    const tbody = $('#formaciones tbody');
    tbody.empty();

    this.formaciones.forEach(f => {
      const row = `
        <tr data-id="${f.id}">
          <td class="text-center align-middle">
            <button class="btn btn-info btn-sm btn-info-detalle" title="Ver info"><i class="fa fa-list"></i></button>
          </td>
          <td>${f.id}</td>
          <td>${f.justificacion}</td>
          <td>${f.duracion} horas</td>
          <td>${f.modalidad}</td>
          <td>${f.cursos[0]}</td>
          <td>${f.cursos[1] || 'No hay curso de final'}</td>
          <td class="text-center align-middle">
            <button class="btn btn-sm btn-outline-primary me-2 btn-editar" title="Editar" data-bs-toggle="modal" data-bs-target="#editarFormacionModal"><i class="fa-solid fa-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-borrar" title="Borrar"><i class="fa-solid fa-trash-can"></i></button>
            <button class="btn btn-sm btn-outline-success btn-inscribir" title="Inscribir"><i class="fa-solid fa-list"></i></button>
          </td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  /**
   * Asocia eventos a los botones de acción en las filas de la tabla.
   */
  public bindEvents() {
    const self = this;

    $(document).off('click', '.btn-info-detalle').on('click', '.btn-info-detalle', function () {
      const id = $(this).closest('tr').data('id');
      const f = self.formaciones.find(x => x.id === id);
      if (f) {
        self.mostrarInformacionCompleta(f);
      }
    });

    $(document).off('click', '.btn-editar').on('click', '.btn-editar', function () {
      const id = $(this).closest('tr').data('id');
      const f = self.formaciones.find(x => x.id === id);
      if (f) {
        self.editarFormacion(f);
      }
    });

    $(document).off('click', '.btn-borrar').on('click', '.btn-borrar', function () {
      const id = $(this).closest('tr').data('id');
      const f = self.formaciones.find(x => x.id === id);
      if (f) {
        self.borrarFormacion(f);
      }
    });

    $(document).off('click', '.btn-inscribir').on('click', '.btn-inscribir', function () {
      const id = $(this).closest('tr').data('id');
      const f = self.formaciones.find(x => x.id === id);
      if (f) {
        self.inscribirUsuarios(f);
      }
    });
  }

  protected inscribirUsuarios(f: Formacion) {
    console.log(f);
    this.router.navigate(['inscribir-usuarios/formacion', f.id]);
  }
}
