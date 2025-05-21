import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {FormacionService} from "../../../../../services/formacion.service";
import {ToastrService} from "ngx-toastr";
import Swal2 from "sweetalert2";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {FormacionFormComponent} from "../formacion-form/formacion-form.component";

@Component({
  selector: 'app-editar-formacion-modal',
  templateUrl: './editar-formacion-modal.component.html',
})
export class EditarFormacionModalComponent{

  @ViewChild(FormacionFormComponent) formComponent!: FormacionFormComponent;
  @Output() formSubmit = new EventEmitter<any>();
  constructor(private formacionService: FormacionService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService) {
  }



  onFormSubmit(data: any) {
    Swal2.fire({
      title: '¿Estás seguro?',
      text: "La formación será actualizada en la base de datos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formacionService.editarFormacion(data).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success("Formación editada exitosamente", "CRUD Formaciones", {
                positionClass: "toast-bottom-right"
              });
              this.formSubmit.emit();
            } else {
              this.toastr.error("Error al editar la formación", "CRUD Formaciones", {
                positionClass: "toast-bottom-right"
              });
              console.error(response)
            }
          },
          error: (error) => {
            this.toastr.error("Error al editar la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
            console.error(error)
          }
        })
      }
    })
  }

  protected clearForm() {
    this.formComponent.clearForm();
  }
}
