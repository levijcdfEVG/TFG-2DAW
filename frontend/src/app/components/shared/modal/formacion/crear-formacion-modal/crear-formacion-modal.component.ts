import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormacionFormComponent } from '../formacion-form/formacion-form.component';
import { FormacionService } from "../../../../../services/formacion.service";
import { ToastrService } from "ngx-toastr";
import Swal2 from "sweetalert2";

/**
 * Componente modal para crear una nueva formación.
 * Muestra un formulario reutilizable y gestiona la confirmación y envío al backend.
 * @author Levi Josué Candeias de Figueiredo
 * @email levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net
 */
@Component({
  selector: 'app-crear-formacion-modal',
  templateUrl: './crear-formacion-modal.component.html',
})
export class CrearFormacionModalComponent {

  /**
   * Referencia al componente del formulario de formación.
   */
  @ViewChild(FormacionFormComponent) formComponent!: FormacionFormComponent;

  /**
   * Evento emitido al crear exitosamente una formación.
   */
  @Output() formSubmit = new EventEmitter<any>();

  /**
   * Constructor del componente.
   * @param formacionService Servicio para realizar operaciones CRUD sobre formaciones.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   */
  constructor(
      private formacionService: FormacionService,
      private toastr: ToastrService
  ) {}

  /**
   * Maneja el envío del formulario tras confirmar con el usuario.
   * Llama al servicio para insertar la nueva formación.
   *
   * @param data Datos de la formación a guardar.
   */
  onFormSubmit(data: any): void {
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
              this.formComponent.clearForm();
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

  /**
   * Limpia manualmente el formulario del componente hijo.
   */
  protected clearForm(): void {
    this.formComponent.clearForm();
  }
}
