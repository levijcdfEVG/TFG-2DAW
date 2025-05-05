import { Component } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';

@Component({
  selector: 'app-modificar-centro',
  templateUrl: './modificar-centro.component.html',
  styleUrls: ['./modificar-centro.component.css']
})
export class ModificarCentroComponent {

  centroSeleccionado: any = {};
  dataSource: any[] = [];
  constructor(private centrosService: CentrosService) {}

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
}
