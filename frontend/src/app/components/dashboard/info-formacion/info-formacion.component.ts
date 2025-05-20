import {Component, OnInit} from '@angular/core';
import { FormacionService } from '../../../services/formacion.service'; // Ajusta la ruta si es distinta
import { ChangeDetectorRef } from '@angular/core';
import {Formacion} from "../../../services/interfaces/formacionesResponse";
import {ToastrService} from "ngx-toastr";
import Swal2 from "sweetalert2";
declare const $datatable: any;



@Component({
  selector: 'app-info-sdsda',
  templateUrl: './info-formacion.component.html',
  styleUrls: ['./info-formacion.component.css']
})
export class InfoFormacionComponent implements OnInit {

  public formaciones: Formacion[] = [];
  protected formacionSeleccionada: any = null;

  constructor(
      private formacionService: FormacionService,
      private cdr: ChangeDetectorRef,
      private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchFormaciones();
  }

  protected fetchFormaciones() {
    this.formacionService.getAllFormaciones().subscribe(response => {
      if (response.success) {
        this.formaciones = response.data;
        console.log(this.formaciones);
        this.cdr.detectChanges();
      }
    });
  }

  protected editarFormacion(formacion: any) {
    this.formacionService.setFormacionAEditar(formacion);
    this.cdr.detectChanges();
  }

  protected borrarFormacion(f: Formacion) {
    let id = f.id;

    Swal2.fire({
      title: '¿Estás seguro?',
      text: "La formación será desactivada",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formacionService.desactivarFormacion(id).subscribe(response => {
          if (response.success) {
            this.toastr.success("Formación desactivada exitosamente", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
            this.fetchFormaciones();
          } else {
            this.toastr.error("Error al desactivar la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        });
      }
    });
  }
}
