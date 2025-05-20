import {Component, OnInit} from '@angular/core';
import { FormacionService } from '../../../services/formacion.service'; // Ajusta la ruta si es distinta
import { ChangeDetectorRef } from '@angular/core';
import {Formacion} from "../../../services/interfaces/formacionesResponse";
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
      private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchFormaciones();
  }

  protected fetchFormaciones() {
    this.formacionService.getAllFormaciones().subscribe(response => {
      if (response.success) {
        this.formaciones = response.data;
        this.cdr.detectChanges();
      }
    });
  }

  editarFormacion(formacion: any) {
    this.formacionService.setFormacionAEditar(formacion);
    this.cdr.detectChanges();
  }
}
