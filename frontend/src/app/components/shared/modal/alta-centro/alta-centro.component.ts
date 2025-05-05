import { Component } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';

@Component({
  selector: 'app-alta-centro',
  templateUrl: './alta-centro.component.html',
  styleUrls: ['./alta-centro.component.css']
})
export class AltaCentroComponent {

constructor(private centrosService: CentrosService) {}

  nuevoCentro: {
    nombre_centro: string;
    direccion_centro: string;
    cp: string;
    nombre_localidad: string;
    telefono_centro: string;
    correo_centro: string;
  } = {
    nombre_centro: '',
    direccion_centro: '',
    cp: '',
    nombre_localidad: '',
    telefono_centro: '',
    correo_centro: ''
  };

  dataSource: any[] = [];

  recargarCentros(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data; // Actualizar la tabla con los nuevos datos
      } else {
        console.error('Error al recargar los centros:', response.message);
      }
    }, error => {
      console.error('Error en la solicitud HTTP al recargar los centros:', error);
    });
  }

  crearCentro(): void {
    console.log('Nuevo centro:', this.nuevoCentro);
    // Aquí puedes llamar al servicio para guardar el nuevo centro en el backend
    this.centrosService.crearCentro(this.nuevoCentro).subscribe(response => {
      console.log('Respuesta del backend:', response); // Depurar la respuesta
      if (response.success) {
        alert('Centro creado con éxito');
        this.dataSource.push(response.data); // Agregar el nuevo centro a la tabla
        this.nuevoCentro = {
          nombre_centro: '',
          direccion_centro: '',
          cp: '',
          nombre_localidad: '',
          telefono_centro: '',
          correo_centro: ''
        }; // Limpiar el formulario
        this.recargarCentros();
      } else {
        alert('Error al crear el centro: ' + response.message);
      }
    }, error => {
      console.error('Error en la solicitud HTTP:', error); // Depurar errores HTTP
      alert('Error al comunicarse con el servidor');
    });
  }
}
