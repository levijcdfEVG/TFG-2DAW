import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import 'datatables.net';
declare var $: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})

export class TemplateComponent implements OnInit, AfterViewInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dataTable: any;

  showSweetAlert(): void {
    alert('SweetAlert button clicked!');
  }

  showToastr(): void {
    console.log('Toastr button clicked!');
  }

  fakeUsers = [
    { nombre: 'Ana García', edad: 28, pais: 'España', correo: 'ana@example.com' },
    { nombre: 'Juan Pérez', edad: 35, pais: 'México', correo: 'juan@example.com' },
    { nombre: 'Sara López', edad: 22, pais: 'Argentina', correo: 'sara@example.com' },
    { nombre: 'Lucas Silva', edad: 31, pais: 'Brasil', correo: 'lucas@example.com' },
    { nombre: 'Carmen Ruiz', edad: 26, pais: 'Chile', correo: 'carmen@example.com' },
    { nombre: 'Diego Torres', edad: 30, pais: 'Perú', correo: 'diego@example.com' },
    { nombre: 'Laura Ramírez', edad: 24, pais: 'Colombia', correo: 'laura@example.com' },
    { nombre: 'Pedro Gómez', edad: 29, pais: 'Uruguay', correo: 'pedro@example.com' },
    { nombre: 'María Fernández', edad: 33, pais: 'España', correo: 'maria@example.com' },
    { nombre: 'Luis Herrera', edad: 27, pais: 'Ecuador', correo: 'luis@example.com' }
  ];

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      responsive: true
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataTable = $('#example').DataTable(this.dtOptions);
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}