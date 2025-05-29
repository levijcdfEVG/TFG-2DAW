import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormacionService } from 'src/app/services/formacion.service';
import {ToastrService} from "ngx-toastr";
import {ChangeDetectorRef} from "@angular/core";

/**
 * @fileoverview Componente AsignarUsuarioFormacionComponent para asignar un usuario a una formación.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */
@Component({
  selector: 'app-asignar-usuario-formacion',
  templateUrl: './asignar-usuario-formacion.component.html',
  styleUrls: ['./asignar-usuario-formacion.component.css']
})
export class AsignarUsuarioFormacionComponent implements OnInit {

  constructor(
      private usuarioService: UsuarioService,
      private formacionService: FormacionService,
      private toasts: ToastrService,
      private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {

  }

}
