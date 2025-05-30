import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormacionService } from '../../../../../services/formacion.service';
import {FormControl} from "@angular/forms";
import {UsuarioService} from "../../../../../services/usuario.service";

@Component({
  selector: 'app-asignar-usuarios',
  templateUrl: './asignar-usuarios-formacion-modal.component.html',
  styleUrls: ['./asignar-usuarios-formacion-modal.component.css']
})
export class AsignarUsuariosFormacionModalComponent implements OnInit {

  @Output() updateTable = new EventEmitter<void>();
  protected usuarios: any[] = [];
  protected idFormacion: number = 0;
  usuariosFiltrados = [...this.usuarios];
  filtro: string = '';
  protected usuariosSeleccionados: any[] = [];

  constructor(
      private formacionService: FormacionService,
      private usuariosService: UsuarioService) {}

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
    console.log('Usuarios asignados:', this.usuariosSeleccionados);
    // Aquí emites evento o haces lo que necesites
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
      console.log(response);
      if (response.length > 0) {
        this.usuarios = response;
        this.formacionService.getUsersByFormacion(this.idFormacion).subscribe(response => {
          if (response.success) {
            this.usuariosSeleccionados = response.data;
            console.log(this.usuariosSeleccionados);
          } else {
            console.error('Error al obtener los usuarios de la formación');
          }
        });
        this.usuarios = this.usuarios.filter(u => !this.usuariosSeleccionados.some(us => us.id === u.id));
        this.usuariosFiltrados = [...this.usuarios];
      } else {
        console.error('Error al obtener los usuarios');
      }
    });
  }
}
