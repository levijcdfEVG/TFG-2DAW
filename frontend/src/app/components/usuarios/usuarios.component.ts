import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Subject} from "rxjs";
import 'datatables.net';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dataUsers: any[] = [];
  filterForm!: FormGroup;

  private unsub$= new Subject<void>();

  constructor(
    private userService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosFormulario();
  }

  searchByFilter() {
    // Recoge los datos del formulario
    const params = this.filterForm.value;

    this.userService.getUsersByParams(params).subscribe({
      next: (response) => {
        this.dataUsers = response;
        console.log(this.dataUsers);
        this.cdr.detectChanges();
        this.cargarDataTable();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

// METODOS DEL BUSCADOR ---------------------------------------
  crearFormulario() {
    this.filterForm = this.fb.group({
      nombre: [''],
      apellidos: [''],
      email: [''],
      telefono: [''],
      rol: ['', Validators.required],
      nuevo_educador: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  cargarDatosFormulario() { // Establece valores por defecto
    this.filterForm.patchValue({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      rol: 'all',
      nuevo_educador: 0,
      estado: 0
    });
  }

  resetFilter() {
    this.filterForm.reset({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      rol: 'all',
      nuevo_educador: 0,
      estado: 0
    });
  }

// METODOS DE LA TABLA ---------------------------------------
  cargarDataTable() {
    if ($.fn.DataTable.isDataTable('#usersTable')) {
      $('#usersTable').DataTable().destroy();
    }

    $('#usersTable').DataTable({
      data: this.dataUsers,
      autoWidth: true,
      pageLength: 5,
      searching: false,
      ordering: false,
      lengthChange: false,
      language: {

        lengthMenu: "Mostrar _MENU_ entradas",
        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
        infoEmpty: "Mostrando 0 a 0 de 0 entradas",
        paginate: {
          previous: " <i class='fas fa-chevron-left'></i> Anterior",
          next: "Siguiente <i class='fas fa-chevron-right'></i>"
        }
      },
      columns: [{
        data: 'nombre_user',
      }, {
        data: 'apellido_user',
      }, {
        data: 'correo_user',
      }, {
        data: 'telefono_user',
        className: 'text-end',
      }, {
        data: 'id',
        render: (data: any, row: any) => {
          return `<div class="dropdown text-end pe-3">
                    <button class="btn btn-sm" type="button" id="dropdownMenuButton${data}" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-cog"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${data}">
                      <li><a class="dropdown-item" href="/usuarios/${data}">
                        <i class="fas fa-eye text-theme"></i> Ver ficha
                      </a></li>
                      <li><a class="dropdown-item" href="/usuarios/editar/${data}">
                        <i class="fas fa-${row.activo ? 'check' : 'ban'} text-theme"></i> ${row.activo ? 'Habilitar' : 'Deshabilitar'}
                      </a></li>
                    </ul>
                  </div>`;
        }
      }]
    });
  }
}
