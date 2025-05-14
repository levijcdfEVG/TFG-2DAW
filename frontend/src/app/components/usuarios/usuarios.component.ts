import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dataUsers: User[] = [];
  filterForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  private dataTable: any;

  constructor(
    private userService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosFormulario();
    this.cargarDataTable();
  }

  searchByFilter() {
    // Recoge los datos del formulario
    const params = this.filterForm.value;
    console.log(params); // Debbuging params

    this.userService.getUsersByParams(params).subscribe({
      next: (users) => {
        this.dataUsers = users;
        this.cargarDataTable();
      },
      error: (error) => {
        console.error('Error loading users:', error);
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
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    this.dataTable = $('#usersTable').DataTable({
      data: this.dataUsers,
      autoWidth: false,
      pageLength: 5,
      searching: false,
      ordering: false,
      lengthChange: false,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json' },
      columns: [{
        data: 'nombre',
      },{
        data: 'apellidos',
      },{
        data: 'email',
      },{
        data: 'telefono',
      },{
        data: 'id',
        render: (data: any, type: any, row: any) => {
          return `<div class="dropdown">
                    <button class="btn btn-sm btn-info dropdown-toggle" type="button" id="dropdownMenuButton${data}" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-cog"></i> Acciones
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${data}">
                      <li><a class="dropdown-item" href="/usuarios/${data}">
                        <i class="fas fa-eye"></i> Ver ficha
                      </a></li>
                      <li><a class="dropdown-item" href="/usuarios/editar/${data}">
                        <i class="fas fa-edit"></i> Editar
                      </a></li>
                    </ul>
                  </div>`;
        }
      }]
    });
  }
}
