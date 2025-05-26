import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Subject, takeUntil} from "rxjs";
import { User } from 'src/app/interfaces/user.interface';
import { error } from 'jquery';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dataUsers: any[] = [];
  filterForm!: FormGroup;

  hasSearched: boolean = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createFilterForm();
    this.setDefaultValuesForm();
  }

  searchByFilter() {
    // Recoge los datos del formulario
    const params = this.filterForm.value;
    
    this.userService.getUsersByParams(params)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: User[]) => {
        this.dataUsers = response;
        this.hasSearched = true;
        this.cdr.detectChanges();
        if ($.fn.DataTable.isDataTable('#usersTable')) {
          console.log('DataTable está cargado');
          $('#usersTable').DataTable().destroy();
        }
        this.loadDataTable();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  changeStatus(id: number) {
    console.log(id);
    this.userService.changeStatus(id)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response: any) => {
          console.log('Estado del usuario cambiado', response);
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al modificar el estado del usuario:', error);
        }
      })

  }

// METODOS DEL BUSCADOR ---------------------------------------
  createFilterForm() {
    this.filterForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      role: [0],
      new_educator: [0],
      status: [1],
    });
  }

  setDefaultValuesForm() { // Establece valores por defecto
    this.filterForm.patchValue({
      name: '',
      surname: '',
      email: '',
      phone: '',
      role: 0,
      new_educator: 0,
      status: 1,
    });
  }

  resetFilter() {
    this.filterForm.reset({
      name: '',
      surname: '',
      email: '',
      phone: '',
      role: 0,
      new_educator: 0,
      status: 1,
    });
  }

// METODOS DE LA TABLA ---------------------------------------
  loadDataTable() {
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
        className: 'ps-4',
      }, {
        data: 'apellido_user',
      }, {
        data: 'correo_user',
      }, {
        data: 'nombre_rol',
      },{
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
                      <li>
                        <a class="dropdown-item" href="/usuarios/${data}">
                          <i class="fas fa-eye text-theme"></i> Ver ficha
                        </a>
                      </li>
                      <li>
                        <button class="dropdown-item status-change-btn" data-id="${data}" data-status="${row.activo}">
                          <i class="fas fa-${row.activo ? 'check' : 'ban'} text-theme"></i> ${row.activo ? 'Habilitar' : 'Deshabilitar'}
                        </button>
                      </li>
                    </ul>
                  </div>`;
        }
      }]
    });

    // Agregar el evento click después de inicializar la tabla
    $('#usersTable').on('click', '.status-change-btn', (event: any) => {
      const id = $(event.currentTarget).data('id');
      console.log(id);
      this.changeStatus(id);
    });
  }
}
