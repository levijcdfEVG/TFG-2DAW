import {Component, OnInit} from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormacionService } from 'src/app/services/formacion.service';
import {ToastrService} from "ngx-toastr";
import {ChangeDetectorRef} from "@angular/core";
import Swal2 from "sweetalert2";
import {ActivatedRoute} from "@angular/router";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';

/**
 * @fileoverview Componente AsignarUsuarioFormacionComponent para asignar un usuario a una formación.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */
@Component({
    selector: 'app-asignar-usuario-formacion',
    templateUrl: './inscripcion-formacion.component.html',
    styleUrls: ['./inscripcion-formacion.component.css']
})
export class InscripcionFormacionComponent implements OnInit {

    protected users: any[] = [];
    protected formacionId: number = 0;

    constructor(
        private usuarioService: UsuarioService,
        private formacionService: FormacionService,
        private toasts: ToastrService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getFormacionidFromUrl();
    }

    private getFormacionidFromUrl(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.formacionId = parseInt(id);
            this.toasts.info('Registros de la formación de id: ' + this.formacionId, 'Asignar Usuarios', {
                positionClass: 'toast-bottom-right'
            });
            this.loadUsers(); // ahora que tenemos formacionId cargamos usuarios
        } else {
            this.toasts.error('No se pudo obtener el id de la formación', 'Asignar Usuarios', {
                positionClass: 'toast-bottom-right'
            });
        }
    }

    private loadUsers(): void {
        this.usuarioService.getUsersByParams({
            name: "",
            surname: "",
            email: "",
            phone: "",
            role: "1",
            new_educator: 0,
            status: 1
        }).subscribe({
            next: (next) => {
                this.users = next;
                console.log(this.users);
                this.cdr.detectChanges();
                this.loadDataTable();
            },
            error: (error) => {
                console.error('Error al obtener usuarios:', error);
                this.cdr.detectChanges();
            }
        });
    }

    private loadDataTable() {
        const table: any = $('#usuariosFormacion');
        if ($.fn.dataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        const tbody = $('#usuariosFormacion tbody');
        tbody.empty();

        this.users.forEach(u => {
            const row = `
        <tr data-id="${u.id}">
          <td>${u.nombre_user} ${u.apellido_user}</td>
          <td>${u.correo_user}</td>
          <td>${u.telefono_user || '-'}</td>
          <td>${u.nombre_rol}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary btn-asignar" title="Asignar usuario">
              <i class="fa fa-user-plus"></i>
            </button>
          </td>
        </tr>
      `;
            tbody.append(row);
        });

        this.cdr.detectChanges();

        $('#usuariosFormacion').DataTable({
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

        this.bindEvents();
    }

    private bindEvents() {
        const self = this;

        $(document).off('click', '.btn-asignar').on('click', '.btn-asignar', function () {
            const idUsuario = $(this).closest('tr').data('id');

            Swal2.fire({
                title: '¿Asignar usuario a la formación?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, asignar',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    self.asignarUsuario(idUsuario);
                }
            });
        });
    }

    private asignarUsuario(idUsuario: number) {

        console.log(this.formacionId);
        console.log(idUsuario);
        // this.formacionService.assignUsersToFormacion(this.formacionId, [idUsuario]).subscribe({
        //     next: (response) => {
        //         if (response.success) {
        //             this.toasts.success('Usuario asignado correctamente', 'Asignación');
        //         } else {
        //             this.toasts.error('Error al asignar usuario', 'Asignación');
        //         }
        //     },
        //     error: (error) => {
        //         this.toasts.error('Error en la petición', 'Asignación');
        //     }
        // });
    }
}
