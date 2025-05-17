import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {FormacionService} from "../../../../../services/formacion.service";

@Component({
  selector: 'app-editar-formacion-modal',
  templateUrl: './editar-formacion-modal.component.html',
})
export class EditarFormacionModalComponent {
  @Input() formacion!: any;

  constructor(private formacionService: FormacionService) {}


  onFormSubmit(data: any) {
    // const payload = { ...data, id: this.formacion.id };
    // this.formacionService.actualizar(payload).subscribe({
    //   next: () => {
    //     alert('Formación actualizada con éxito');
    //     this.cerrar();
    //     // Aquí emitir evento para que el padre actualice la lista
    //   },
    //   error: (err) => alert('Error al actualizar formación: ' + err.message)
    // });
  }
}
