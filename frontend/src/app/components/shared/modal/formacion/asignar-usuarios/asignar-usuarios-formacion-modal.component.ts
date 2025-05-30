import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormacionService } from '../../../../../services/formacion.service';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-asignar-usuarios',
  templateUrl: './asignar-usuarios-formacion-modal.component.html',
  styleUrls: ['./asignar-usuarios-formacion-modal.component.css']
})
export class AsignarUsuariosFormacionModalComponent implements OnInit {

  @Output() updateTable = new EventEmitter<void>();
  protected usuarios = [
    { id: 1, nombre: 'Levi' },
    { id: 2, nombre: 'Pepe' },
    { id: 3, nombre: 'Carlos' }
  ];

  usuariosFiltrados = [...this.usuarios];
  filtro: string = '';
  protected usuariosSeleccionados: any[] = [];

  constructor(private formacionService: FormacionService) {}

  ngOnInit(): void {

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

}
