import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormacionService } from "../../../../../services/formacion.service";
import { ToastrService } from "ngx-toastr";
import Swal2 from "sweetalert2";
import { FormacionFormComponent } from "../formacion-form/formacion-form.component";

/**
 * Componente modal para editar una formación existente.
 * Utiliza el formulario de formaciones y maneja la confirmación y actualización en base de datos.
 * @author Levi Josué Candeias de Figueiredo
 * @email levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net
 */
@Component({
  selector: 'app-editar-formacion-modal',
  templateUrl: './editar-formacion-modal.component.html',
})
export class EditarFormacionModalComponent {

  /**
   * Referencia al componente del formulario de formación hijo.
   */
  @ViewChild(FormacionFormComponent) formComponent!: FormacionFormComponent;

  /**
   * Evento emitido cuando se ha editado correctamente la formación.
   */
  @Output() formSubmit = new EventEmitter<any>();

  constructor(
      private formacionService: FormacionService,
      private cdr: ChangeDetectorRef,
      private toastr: ToastrService
  ) {}

  /**
   * Maneja el envío del formulario tras confirmar con el usuario.
   * Realiza la petición al servicio para actualizar la formación.
   *
   * @param data Datos de la formación enviados desde el formulario.
   */
  onFormSubmit(data: any): void {
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
              console.error(response);
            }
          },
          error: (error) => {
            this.toastr.error("Error al editar la formación", "CRUD Formaciones", {
              positionClass: "toast-bottom-right"
            });
            console.error(error);
          }
        });
      }
    });
  }

  /**
   * Limpia manualmente el formulario del componente hijo.
   */
  protected clearForm(): void {
    this.formComponent.clearForm();
  }
}
