import { Component } from '@angular/core';

@Component({
  selector: 'app-info-formacion',
  templateUrl: './info-formacion.component.html',
  styleUrls: ['./info-formacion.component.css']
})
export class InfoFormacionComponent {
  public formaciones : any = [
    { id: 1, nombre: 'Formación A', duracion: '1 año', modalidad: 'Presencial', justificacion: 'Lorem Ipsum...', dirigidoA: 'Lorem Ipsum...' },
    { id: 2, nombre: 'Formación B', duracion: '1 año', modalidad: 'Telemática', justificacion: 'Lorem Ipsum...', dirigidoA: 'Lorem Ipsum...' },
    { id: 3, nombre: 'Formación C', duracion: '1 año', modalidad: 'Presencial', justificacion: 'Lorem Ipsum...', dirigidoA: 'Lorem Ipsum...' },
  ];
}
