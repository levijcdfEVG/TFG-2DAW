import { Component } from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-alta-centro',
  templateUrl: './alta-centro.component.html',
  styleUrls: ['./alta-centro.component.css']
})
export class AltaCentroComponent {

  formCentro!: FormGroup;

  constructor(private fb: FormBuilder, private centrosService: CentrosService, private toastr: ToastrService) {}

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

  // Validador de campos sin números
  static sinNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/;
    return control.value && !regex.test(control.value) ? { contieneNumeros: true } : null;
  }

  // Validador de campos con solo números
  static soloNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]+$/;
    return control.value && !regex.test(control.value) ? { contieneLetras: true } : null;
  }

  // Validador de correo electronico
  static emailFundacionLoyolaValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/;
    return control.value && !regex.test(control.value) ? { dominioInvalido: true } : null;
  }

  ngOnInit() {
    this.formCentro = this.fb.group({
      nombre_centro: ['', [
        Validators.required,
        Validators.maxLength(50),
        AltaCentroComponent.sinNumerosValidator
      ]],
      direccion_centro: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      cp: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{5}$/),
        AltaCentroComponent.soloNumerosValidator
      ]],
      nombre_localidad: ['', [
        Validators.required,
        AltaCentroComponent.sinNumerosValidator
      ]],
      telefono_centro: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/),
        AltaCentroComponent.soloNumerosValidator
      ]],
      correo_centro: ['', [
        Validators.required,
        Validators.maxLength(255),
        AltaCentroComponent.emailFundacionLoyolaValidator
      ]]
  });
}

  recargarCentros(): void {
    this.centrosService.getCentros().subscribe(response => {
      if (response.success) {
        this.dataSource = response.data; // Actualizar la tabla con los nuevos datos
      } else {
        this.toastr.error('Error al recargar los centros: ' + response.message, 'Error');
      }
    }, error => {
      this.toastr.error('Error en la solicitud HTTP al recargar los centros.', 'Error');
    });
  }

  

  crearCentro(): void {
    if (this.formCentro.invalid) {
      this.toastr.warning('Por favor, completa todos los campos correctamente.', 'Advertencia');
      return;
    }
  
    // Validar que nombre_localidad coincida con el CP
    this.centrosService.validarLocalidad(this.nuevoCentro.nombre_localidad, this.nuevoCentro.cp).subscribe(response => {
      if (!response.success) {
        this.toastr.warning('El código postal no coincide con la localidad.', 'Advertencia');
        return;
      }
  
      console.log('Nuevo centro:', this.nuevoCentro);
  
      // Aquí puedes llamar al servicio para guardar el nuevo centro en el backend
      this.centrosService.crearCentro(this.nuevoCentro).subscribe(response => {
        if (response.success) {
          this.toastr.success('Centro creado con éxito', 'Éxito');
          this.dataSource.push(response.data); // Agregar el nuevo centro a la tabla
          this.formCentro.reset(); // Limpiar el formulario
          this.recargarCentros();
        } else {
          this.toastr.error('Error al crear el centro: ' + response.message, 'Error');
        }
      }, error => {
        this.toastr.error('Error al comunicarse con el servidor.', 'Error');
      });
    }, error => {
      this.toastr.error('Error al validar la localidad.', 'Error');
    });
  }
}

