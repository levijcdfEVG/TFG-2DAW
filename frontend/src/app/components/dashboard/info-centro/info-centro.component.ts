import { Component, OnInit } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';


@Component({
  selector: 'app-info-centro',
  templateUrl: './info-centro.component.html',
  styleUrls: ['./info-centro.component.css']
})
export class InfoCentroComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre_centro',
    'direccion_centro',
    'cp',
    'correo_centro',
    'telefono_centro',
    'nombre_localidad'
  ];
  dataSource: any[] = [];

  nuevoCentro: any = {
    nombre_centro: '',
    direccion_centro: '',
    cp: '',
    nombre_localidad: '',
    telefono_centro: '',
    correo_centro: ''
  };

  centroSeleccionado: any = {};

  constructor(private centrosService: CentrosService) {}

  ngOnInit(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data;
      } else {
        console.error(response.message);
      }
    });
  }

  modificarRegistro(element: any): void {
    this.centroSeleccionado = { ...element }; // Copiar los datos del registro seleccionado
    const modal = document.getElementById('modificarCentroModal');
    if (modal) {
      // Ensure Bootstrap is imported and available
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show(); // Mostrar el modal
    }
  }

  guardarCambiosCentro(): void {
    console.log('Centro modificado:', this.centroSeleccionado);
    // Aquí puedes llamar al servicio para actualizar el registro en el backend
    this.centrosService.modificarCentro(this.centroSeleccionado).subscribe(response => {
      if (response.success) {
        alert('Centro modificado con éxito');
        // Actualizar el registro en la tabla
        const index = this.dataSource.findIndex(c => c.id === this.centroSeleccionado.id);
        if (index !== -1) {
          this.dataSource[index] = { ...this.centroSeleccionado };
        }
      } else {
        alert('Error al modificar el centro');
      }
    });
  }
  
  borrarRegistro(element: any): void {
    const confirmacion = confirm(`¿Estás seguro de que deseas borrar el registro de ${element.nombre_centro}?`);
    if (confirmacion) {
      console.log('Borrar registro:', element);
      // Aquí puedes llamar a un servicio para eliminar el registro del backend
    }
  }

  
}
