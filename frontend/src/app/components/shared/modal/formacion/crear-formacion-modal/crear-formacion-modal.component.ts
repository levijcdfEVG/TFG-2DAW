import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { FormacionFormComponent } from '../formacion-form/formacion-form.component';
import {FormacionService} from "../../../../../services/formacion.service";
import {ToastrService} from "ngx-toastr";
import Swal2 from "sweetalert2";


@Component({
  selector: 'app-crear-formacion-modal',
  templateUrl: './crear-formacion-modal.component.html',
})
export class CrearFormacionModalComponent {
  @ViewChild(FormacionFormComponent) formComponent!: FormacionFormComponent;
  @Output() formSubmit = new EventEmitter<any>();

  constructor(private formacionService: FormacionService,
              private toastr: ToastrService ) {}

  onFormSubmit(data: any) {
    Swal2.fire({
      title: '¿Estás seguro?',
      text: "La formación será guardada en la base de datos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formacionService.insertarFormacion(data).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success("Formación creada exitosamente", "CRUD Formaciones", {
                positionClass: "toast-bottom-right"
              });
              this.formSubmit.emit();
            } else {
              this.toastr.error("Error al crear la formación", "CRUD Formaciones", {
                positionClass: "toast-bottom-right"
              });
            }
          },
          error: () => {
            this.toastr.error("Error al crear la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
          }
        });
      }
    });
  }


    protected clearForm() {
        this.formComponent.clearForm();
    }
}
