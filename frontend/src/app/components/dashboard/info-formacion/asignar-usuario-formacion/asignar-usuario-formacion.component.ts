import {Component, OnInit} from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormacionService } from 'src/app/services/formacion.service';
import {ToastrService} from "ngx-toastr";
import {ChangeDetectorRef} from "@angular/core";
import Swal2 from "sweetalert2";
import {ActivatedRoute} from "@angular/router";

/**
 * @fileoverview Componente AsignarUsuarioFormacionComponent para asignar un usuario a una formación.
 * @author Levi Josué Candeias de Figueiredo <levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net>
 */
@Component({
  selector: 'app-asignar-usuario-formacion',
  templateUrl: './asignar-usuario-formacion.component.html',
  styleUrls: ['./asignar-usuario-formacion.component.css']
})
export class AsignarUsuarioFormacionComponent implements OnInit{

  protected users: any[] = [];
  protected formacionId: number = 0;
  constructor(
      private usuarioService: UsuarioService,
      private formacionService: FormacionService,
      private toasts: ToastrService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
      this.getFormacionidFromUrl();
      this.loadUsers();
  }

  private loadUsers(): void {
      this.usuarioService.getUsersByParams(
          {
            "name": "",
            "surname": "",
            "email": "",
            "phone": "",
            "role": "1",
            "new_educator": 0,
            "status": 1
          }
      ).subscribe(
          next => {
            this.users = next;
            this.cdr.detectChanges();
          },
          error => {
            console.error('Error al obtener usuarios:', error);
            this.cdr.detectChanges();
          }
      )
  }

  private getFormacionidFromUrl(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formacionId = parseInt(id);
      this.toasts.info('Añadir usuarios a la formación de id: ' + this.formacionId, 'Asignar Usuarios', {
        positionClass: 'toast-bottom-right'
      });
    }else {
      this.toasts.error('No se pudo obtener el id de la formación', 'Asignar Usuarios', {
        positionClass: 'toast-bottom-right'
      });
    }
  }

}
