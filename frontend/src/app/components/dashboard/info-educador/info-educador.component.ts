import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";
import { RoleService } from './../../../services/role.service';
import { Role } from 'src/app/interfaces/role.interface';
import * as $ from "jquery";

@Component({
  selector: 'app-info-educador',
  templateUrl: './info-educador.component.html',
  styleUrls: ['./info-educador.component.css']
})
export class InfoEducadorComponent implements OnInit  {

  dataUsers: any[] = [];
  roleData: Role[] = [];
  
  filterForm!: FormGroup;

  hasSearched: boolean = false;

  private unsubscribe$ = new Subject<void>();

  private readonly defaultValues = { // Establece valores por defecto en el formulario
    name: '',
    surname: '',
    email: '',
    phone: '',
    role: 0,
    new_educator: 0,
    status: 1
  } as const;

  constructor(
      private userService: UsuarioService,
      private roleService: RoleService,
      private fb: FormBuilder,
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createFilterForm();

    this.loadRoles();
    this.setDefaultValuesForm();

    // Suscribirse a los cambios en los usuarios
    this.userService.usuariosActualizados$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      setTimeout(() => {
        this.searchByFilter();
      }, 200); // Recargar la tabla cuando hay cambios
    });
  }

  /**
   * Realiza la búsqueda de usuarios según los filtros seleccionados
   * Destruye la tabla existente si existe y crea una nueva con los datos filtrados
   */
  searchByFilter() {
    const params = this.filterForm.value;
    const table: any = $('#usersTable');
    if ($.fn.dataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    this.loadUsers(params);
  }

  /**
   * Cambia el estado de un usuario (activo/inactivo)
   * @param id - ID del usuario a modificar
   */
  changeStatus(userId: number) {
    console.log(userId);

    this.userService.changeStatus(userId)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        this.userService.notificarCambio();
      },
      error: (error: any) => {
        console.error('Error al modificar el estado del usuario:', error);
      }
    })
  }

// METODOS DEL BUSCADOR ---------------------------------------
  /**
   * Crea el formulario de filtros con los valores por defecto
   */
  createFilterForm() {
    this.filterForm = this.fb.group(this.defaultValues);
  }

  /**
   * Establece los valores por defecto en el formulario
   */
  setDefaultValuesForm() {
    this.filterForm.patchValue(this.defaultValues);
  }

  /**
   * Resetea el formulario a sus valores por defecto
   */
  resetFilter() {
    this.filterForm.reset(this.defaultValues);
  }

  /**
   * Verifica si el formulario tiene los valores por defecto
   * @returns boolean - true si todos los campos tienen valores por defecto
   */
  isFormDefault(): boolean {
    return Object.entries(this.defaultValues)
      .every(([key, value]) => 
        this.filterForm.get(key)?.value === value
      );
  }
// CARGA DE DATOS ---------------------------------------
  /**
   * Carga los usuarios según los parámetros de filtrado especificados
   * @param params - Objeto con los parámetros de filtrado (nombre, apellidos, email, etc.)
   * Realiza una llamada al servicio para obtener los usuarios filtrados
   * Actualiza la tabla y marca que se ha realizado una búsqueda
   */
  loadUsers(params: any) {
    this.userService.getUsersByParams(params)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        this.dataUsers = response;
        this.hasSearched = true;
        this.cdr.detectChanges();
        this.loadDataTable();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  /**
   * Carga los roles desde el servicio y los almacena en roleData
   * Se utiliza para poblar el selector de roles en el formulario de filtros
   */
  loadRoles() {
    this.roleService.getAllRoles().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: Role[]) => {
        this.roleData = response;
      },
      error: (error: any) => {
        console.error('Error al obtener roles:', error);
      }

    });
  }

// METODOS DE LA TABLA ---------------------------------------
  /**
   * Inicializa y configura la tabla de usuarios con DataTables
   * Incluye la configuración de columnas, paginación y eventos
   */
  loadDataTable() {
    setTimeout(() => {
      $('#usersTable').DataTable({
        data: this.dataUsers,
        autoWidth: false,
        pageLength: 5,
        searching: false,
        ordering: false,
        lengthChange: false,
        pagingType: 'simple_numbers',
        language: {
          lengthMenu: "Mostrar _MENU_ entradas",
          info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
          infoEmpty: "Mostrando 0 a 0 de 0 entradas",
          paginate: {
            first: "",
            previous: " <i class='fas fa-chevron-left'></i> Anterior",
            next: "Siguiente <i class='fas fa-chevron-right'></i>",
            last: ""
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
                        <button class="dropdown-item view-user-btn" data-id="${data}">
                          <i class="fas fa-eye text-theme"></i> Ver ficha
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item status-change-btn" data-id="${data}" data-status="${row.estado}">
                          Cambiar estado
                        </button>
                      </li>
                    </ul>
                  </div>`;
          }
        }]
      });
    }, 100);

    $('#usersTable').on('click', '.view-user-btn', (event: any) => {
      const id = $(event.currentTarget).data('id');
      this.router.navigate(['/info-educadores', id]);
    });

    $('#usersTable').on('click', '.status-change-btn', (event: any) => {
      const id = $(event.currentTarget).data('id');
      this.changeStatus(id);
    });
  }
}
