/**
 * @fileoverview Componente para asignar usuarios a una formación específica mediante un modal.
 * Permite seleccionar usuarios educadores no asignados actualmente a la formación y guardarlos.
 *
 * @component
 * @author Levi Josué Candeias de Figueiredo
 */

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormacionService } from '../../../../../services/formacion.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import Swal2 from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import {SharedService} from "../../../../../services/shared.service";

@Component({
  selector: 'app-asignar-usuarios',
  templateUrl: './asignar-usuarios-formacion-modal.component.html',
  styleUrls: ['./asignar-usuarios-formacion-modal.component.css']
})
export class AsignarUsuariosFormacionModalComponent implements OnInit {

  /**
   * Evento emitido cuando se actualiza la asignación de usuarios, usado para refrescar la tabla externa.
   */
  @Output() updateTable = new EventEmitter<void>();

  /**
   * Lista de usuarios disponibles para asignar.
   */
  protected usuarios: any[] = [];

  /**
   * ID de la formación actual a la que se van a asignar los usuarios.
   */
  protected idFormacion: number = 0;

  /**
   * Lista de usuarios filtrados por el buscador.
   */
  protected usuariosFiltrados = [...this.usuarios];

  /**
   * Término de búsqueda utilizado para filtrar usuarios por nombre o apellido.
   */
  protected filtro: string = '';

  /**
   * Lista de usuarios que ya están asignados a la formación (no se pueden volver a asignar).
   */
  protected usuariosNoSeleccionables: any[] = [];

  /**
   * Lista de usuarios seleccionados para ser asignados a la formación.
   */
  protected usuariosSeleccionados: any[] = [];

  constructor(
      private formacionService: FormacionService,
      private usuariosService: UsuarioService,
      private toastr: ToastrService,
      private cdr: ChangeDetectorRef,
      private sharedService: SharedService
  ) {}

  /**
   * Inicializa el componente obteniendo el ID de la formación desde el servicio
   * y cargando los usuarios disponibles para asignar.
   */
  ngOnInit(): void {
    this.formacionService.getIdFormacion().subscribe(
        id => {
          this.idFormacion = id;
        },
        error => {
          console.error('Error al obtener el id de la formación:', error);
        }
    );
    this.loadUsers();
  }

  /**
   * Filtra la lista de usuarios por nombre o apellido usando el valor del filtro.
   */
  public filtrarUsuarios(): void {
    const term = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
        u.nombre_user.toLowerCase().includes(term) ||
        u.apellido_user.toLowerCase().includes(term)
    );
  }

  /**
   * Verifica si un usuario está actualmente seleccionado para ser asignado.
   * @param usuario Usuario a verificar
   * @returns true si está seleccionado, false en caso contrario
   */
  public isSeleccionado(usuario: any): boolean {
    return this.usuariosSeleccionados.some(u => u.id === usuario.id);
  }

  /**
   * Alterna la selección de un usuario.
   * Si ya estaba seleccionado, lo deselecciona; si no, lo agrega.
   * @param usuario Usuario a alternar
   */
  public toggleSeleccion(usuario: any): void {
    if (this.isSeleccionado(usuario)) {
      this.usuariosSeleccionados = this.usuariosSeleccionados.filter(u => u.id !== usuario.id);
    } else {
      this.usuariosSeleccionados.push(usuario);
    }
  }

  /**
   * Guarda los cambios realizados, asignando los usuarios seleccionados a la formación actual.
   * Muestra una alerta de confirmación antes de proceder.
   */
  public guardar(): void {
    Swal2.fire({
      title: '¿Desea guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const idsUsuarios = this.usuariosSeleccionados.map(u => u.id);

        this.formacionService.asignUserFormacion(this.idFormacion, idsUsuarios).subscribe(
            response => {
              if (response.success) {
                this.updateTable.emit();
                this.usuariosSeleccionados = [];
                this.filtro = '';
                this.loadUsers();
                this.cdr.detectChanges();
                this.toastr.success('Los cambios se guardaron correctamente', 'Guardado', {
                  positionClass: 'toast-bottom-right'
                });
              } else {
                this.toastr.error('Error al guardar los cambios', 'Error');
              }
            },
            error => {
              this.toastr.error('Error al guardar los cambios', 'Error');
            }
        );
      }
    });
  }

  /**
   * Carga todos los usuarios educadores activos que no estén ya asignados a la formación actual.
   * También filtra los que ya están asignados para que no aparezcan como disponibles.
   */
  private loadUsers(): void {
    const idRol = this.sharedService.getIdRol();
    const idCentro = this.sharedService.getIdCentro();

    const filtros: any = {
      name: '',
      surname: '',
      email: '',
      phone: '',
      role: '1', // educadores
      new_educator: '',
      status: 1
    };

    // Si el usuario es responsable (rol 3), añadimos idCentro al filtro
    if (idRol === 3 && idCentro !== null) {
      filtros.idCentro = idCentro;
    }

    this.usuariosService.getUsersByParams(filtros).subscribe(response => {
      if (response.length > 0) {
        this.usuarios = response;

        this.formacionService.getUsersByFormacion(this.idFormacion).subscribe(response => {
          if (response.success) {
            this.usuariosNoSeleccionables = response.data;

            this.usuarios = this.usuarios.filter(u =>
                !this.usuariosNoSeleccionables.some(us => us.id === u.id)
            );

            this.usuariosFiltrados = [...this.usuarios];
          } else {
            console.error('Error al obtener los usuarios de la formación');
            this.usuariosFiltrados = [...this.usuarios];
          }
        });

      } else {
        console.error('Error al obtener los usuarios');
      }
    });
  }
}
