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
    public usuariosABorrar: number[] = [];

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
            this.formacionService.setIdFormacion(this.formacionId);
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
        this.formacionService.getUsersByFormacion(this.formacionId).subscribe(response => {
            if (response.success) {
                this.users = response.data;
                this.loadDataTable();
            } else {
                this.toasts.error('No se pudo obtener los usuarios de la formación', 'Asignar Usuarios', {
                    positionClass: 'toast-bottom-right'
                });
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
          <td>
            ${u.id_rol === 1 ? 'Educador' : (u.id_rol === 2 ? 'Administrador' : (u.id_rol === 3 ? 'Responsable de centro' : '-'))}
          </td>
          <td>
            <button class="btn btn-sm btn-outline-danger btn-desasignar" title="Desasignar usuario">
              <i class="fa fa-user-minus"></i>
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
        $(document).off('click', '.btn-desasignar').on('click', '.btn-desasignar', (event) => {
            const button = $(event.currentTarget);
            const idUsuario = button.closest('tr').data('id');

            // Alternar selección
            const index = this.usuariosABorrar.indexOf(idUsuario);
            if (index === -1) {
                this.usuariosABorrar.push(idUsuario);
                button.addClass('btn-danger').removeClass('btn-outline-danger');
            } else {
                this.usuariosABorrar.splice(index, 1);
                button.removeClass('btn-danger').addClass('btn-outline-danger');
            }

            this.cdr.detectChanges();
        });
    }


    public borrarUsuarios() {
        Swal2.fire({
            title: 'Confirmar desasignación',
            text: 'Estas seguro que deseas desasignar esto(s) usuario(s) de la formación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, desasignar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.formacionService.unasignUsersByFormacion(this.formacionId, this.usuariosABorrar).subscribe(response => {
                    if (response.success) {
                        this.toasts.success('Usuarios desasignados correctamente', 'Desasignar Usuarios', {
                            positionClass: 'toast-bottom-right'
                        });
                        this.loadUsers();
                    } else {
                        this.toasts.error('Error al desasignar los usuarios', 'Desasignar Usuarios', {
                            positionClass: 'toast-bottom-right'
                        });
                    }
                });
            }
        });

    }
}
