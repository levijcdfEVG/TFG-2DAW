import { Component, Input } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modificar-centro',
  templateUrl: './modificar-centro.component.html',
  styleUrls: ['./modificar-centro.component.css']
})
export class ModificarCentroComponent {

  @Input() centroSeleccionado: any = {}; // Recibir el registro seleccionado como input
  dataSource: any[] = [];
  datosModificados: any;
  constructor(private centrosService: CentrosService, private toastr: ToastrService) {}

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

   //Validar que todos los campos estén completos  
   if (!this.datosModificados.nombre_centro || 
    !this.datosModificados.direccion_centro || 
    !this.datosModificados.cp || 
    !this.datosModificados.nombre_localidad || 
    !this.datosModificados.telefono_centro || 
    !this.datosModificados.correo_centro) {
      this.toastr.warning('Por favor, completa todos los campos del formulario.', 'Advertencia');
      return;
}

  // Validar que nombre_localidad coincida con el CP
  this.centrosService.validarLocalidad(this.datosModificados.nombre_localidad, this.datosModificados.cp).subscribe(response => {
    if (!response.success) {
      this.toastr.warning('El código postal no coincide con la localidad.', 'Advertencia');
    }
  }, error => {
    console.error('Error en la validación de localidad:', error); // Depurar errores de validación
    this.toastr.error('Error al validar la localidad.', 'Error');
  });

//Validar que nombre_centro y nombre_localidad no contengan números
  const regexNoNum = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/; // Expresión regular para letras, espacios, acentos, puntos, comas y guiones
  if (!regexNoNum.test(this.datosModificados.nombre_centro)) {
    this.toastr.warning('El nombre del centro no puede contener números.', 'Advertencia');
    return;
  }
  if (!regexNoNum.test(this.datosModificados.nombre_localidad)) {
    this.toastr.warning('El nombre de la localidad no puede contener números.', 'Advertencia');
    return;
  }

  //Validar que el CP y el teléfono contengan solo números
  const regexNum = /^[0-9]+$/; // Expresión regular para solo números
  if (!regexNum.test(this.datosModificados.cp)) {
    this.toastr.warning('El código postal solo puede contener números.', 'Advertencia');
    return;
  }
  if (!regexNum.test(this.datosModificados.telefono_centro)) {
    this.toastr.warning('El teléfono solo puede contener números.', 'Advertencia');
    return;
  }

  //Validar que el CP tenga 5 dígitos y el teléfono 9 dígitos
  if (this.datosModificados.cp.length !== 5) {
    this.toastr.warning('El código postal debe tener 5 dígitos.', 'Advertencia');
    return;
  }
  if (this.datosModificados.telefono_centro.length !== 9) {
    this.toastr.warning('El teléfono debe tener 9 dígitos.', 'Advertencia');
    return;
  }

  //Validar que el correo finaliza con @fundacionloyola.es
  const regexEmail = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/; // Expresión regular para validar el correo
  if (!regexEmail.test(this.datosModificados.correo_centro)) {
    this.toastr.warning('El correo electrónico debe finalizar con @fundacionloyola.es.', 'Advertencia');
    return;
  }

  //Validar los maximos caracteres de nombre_centro, direccion_centro y correo_centro
  if (this.datosModificados.nombre_centro.length > 50) {
    this.toastr.warning('El nombre del centro no puede tener más de 50 caracteres.', 'Advertencia');
    return;
  }
  if (this.datosModificados.direccion_centro.length > 50) {
    this.toastr.warning('La dirección del centro no puede tener más de 50 caracteres.', 'Advertencia');
    return;
  }
  if (this.datosModificados.correo_centro.length > 255) {
    this.toastr.warning('El correo electrónico no puede tener más de 255 caracteres.', 'Advertencia');
    return;
  }
  
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
