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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosFormulario();
    this.cargarDataTable();
    
    // Suscribirse a cambios en el formulario
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.searchByFilter();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  searchByFilter() {

  }

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

  cargarDatosFormulario() {
    // Establecer valores por defecto
    this.filterForm.patchValue({
      rol: '0',
      nuevo_educador: null,
      estado: null
    });
    this.searchByFilter(); // Cargar datos iniciales
  }

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
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
      },
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
          return `<a href="/usuarios/${data}" class="btn btn-sm btn-info">
                    <i class="fas fa-eye"></i> Ver ficha
                  </a>`;
        }
      }]
    });
  }

  actualizarDataTable() {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.dataUsers);
      this.dataTable.draw();
    } else {
      this.cargarDataTable();
    }
  }

  resetFilter() {
    this.filterForm.reset({
      rol: '0',
      nuevo_educador: null,
      estado: null
    });
    this.searchByFilter();
  }

  verFichaUsuario(id: number) {
    this.router.navigate(['/usuarios', id]);
  }
}
