import { Component, ViewChild } from '@angular/core';
import { FormacionFormComponent } from '../formacion-form/formacion-form.component';
import {FormacionService} from "../../../../../services/formacion.service";


@Component({
  selector: 'app-crear-formacion-modal',
  templateUrl: './crear-formacion-modal.component.html',
})
export class CrearFormacionModalComponent {
  @ViewChild(FormacionFormComponent) formComponent!: FormacionFormComponent;

  constructor(private formacionService: FormacionService) {}

  onFormSubmit(data: any) {
  //   this.formacionService.crear(data).subscribe({
  //     next: () => {
  //       alert('Formación creada con éxito');
  //       this.cerrar();
  //       // Aquí podrías emitir un evento para que el padre actualice la lista
  //     },
  //     error: (err) => alert('Error al crear formación: ' + err.message)
  //   });
  }
}
