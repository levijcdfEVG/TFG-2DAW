import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormacionService } from '../../../../../services/formacion.service';
import {FormControl} from "@angular/forms";
import {UsuarioService} from "../../../../../services/usuario.service";
import Swal2 from "sweetalert2";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-asignar-usuarios',
  templateUrl: './asignar-usuarios-formacion-modal.component.html',
  styleUrls: ['./asignar-usuarios-formacion-modal.component.css']
})
export class AsignarUsuariosFormacionModalComponent implements OnInit {

  @Output() updateTable = new EventEmitter<void>();
  protected usuarios: any[] = [];
  protected idFormacion: number = 0;
  protected usuariosFiltrados = [...this.usuarios];
  protected filtro: string = '';
  protected usuariosNoSeleccionables: any[] = [];
  protected usuariosSeleccionados: any[] = [];

  constructor(
      private formacionService: FormacionService,
      private usuariosService: UsuarioService,
      private toastr: ToastrService,
      private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.formacionService.getIdFormacion().subscribe(
        id => {
          this.idFormacion = id;
        },
        error => {
          console.error('Error al obtener el id de la formación:', error);
        }
    )
    this.loadUsers();
  }

  filtrarUsuarios() {
    const term = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
        u.nombre.toLowerCase().includes(term)
    );
  }

  isSeleccionado(usuario: any) {
    return this.usuariosSeleccionados.some(u => u.id === usuario.id);
  }

  toggleSeleccion(usuario: any) {
    if (this.isSeleccionado(usuario)) {
      this.usuariosSeleccionados = this.usuariosSeleccionados.filter(u => u.id !== usuario.id);
    } else {
      this.usuariosSeleccionados.push(usuario);
    }
  }

  guardar() {
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


  private loadUsers() {
    this.usuariosService.getUsersByParams(
        {
          "name": "",
          "surname": "",
          "email": "",
          "phone": "",
          "role": "1",
          "new_educator": '',
          "status": 1
        }
    ).subscribe(response => {
      if (response.length > 0) {
        this.usuarios = response;

        this.formacionService.getUsersByFormacion(this.idFormacion).subscribe(response => {
          if (response.success) {
            this.usuariosNoSeleccionables = response.data;

            // Ahora que ya tienes usuariosNoSeleccionables, haces el filtro correctamente
            this.usuarios = this.usuarios.filter(u =>
                !this.usuariosNoSeleccionables.some(us => us.id === u.id)
            );

            this.usuariosFiltrados = [...this.usuarios];
          } else {
            console.error('Error al obtener los usuarios de la formación');
            this.usuariosFiltrados = [...this.usuarios]; // aunque no tengas no seleccionables, muestra todos
          }
        });

      } else {
        console.error('Error al obtener los usuarios');
      }
    });
  }
}
