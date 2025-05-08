import { Component, Input } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';

@Component({
  selector: 'app-modificar-centro',
  templateUrl: './modificar-centro.component.html',
  styleUrls: ['./modificar-centro.component.css']
})
export class ModificarCentroComponent {

  @Input() centroSeleccionado: any = {}; // Recibir el registro seleccionado como input
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
    const emailReferencia = this.centroSeleccionado.correo_centro; // Guardar el email como referencia
    const datosModificados = { ...this.centroSeleccionado }; // Crear un objeto con los datos modificados
  
    console.log('Email de referencia:', emailReferencia);
    console.log('Datos modificados:', datosModificados);
  
    // Aquí llamaremos al servicio para realizar el delete y luego el insert
    this.centrosService.modificarCentro(emailReferencia, datosModificados).subscribe(response => {
      if (response.success) {
        alert('Centro modificado con éxito');
        // Actualizar el registro en la tabla
        const index = this.dataSource.findIndex(c => c.correo_centro === emailReferencia);
        if (index !== -1) {
          this.dataSource[index] = { ...datosModificados };
        }
      } else {
        alert('Error al modificar el centro');
      }
    });
  }
}
