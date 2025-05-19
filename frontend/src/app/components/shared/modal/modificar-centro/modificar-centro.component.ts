import { Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modificar-centro',
  templateUrl: './modificar-centro.component.html',
  styleUrls: ['./modificar-centro.component.css']
})
export class ModificarCentroComponent implements OnInit, OnChanges {

  @Input() centroSeleccionado: any = {};
  formCentro!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centrosService: CentrosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formCentro = this.fb.group({
      nombre_centro: ['', [
        Validators.required,
        Validators.maxlength(50),
        ModificarCentroComponent.sinNumerosValidator
      ]],
      direccion_centro: ['', [
        Validators.required,
        Validators.maxlength(50)
      ]],
      cp: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{5}$/),
        ModificarCentroComponent.soloNumerosValidator
      ]],
      nombre_localidad: ['', [
        Validators.required,
        ModificarCentroComponent.sinNumerosValidator
      ]],
      telefono_centro: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/),
        ModificarCentroComponent.soloNumerosValidator
      ]],
      correo_centro: ['', [
        Validators.required,
        Validators.maxlength(255),
        ModificarCentroComponent.emailFundacionLoyolaValidator
      ]]
    });

    // Inicializar el formulario con los datos del centro seleccionado
    this.formCentro.patchValue(this.centroSeleccionado);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en el centro seleccionado y actualizar el formulario
    if (changes['centroSeleccionado'] && this.centroSeleccionado) {
      this.formCentro.patchValue(this.centroSeleccionado);
    }
  }

  // Validadores personalizados
  static sinNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/;
    return control.value && !regex.test(control.value) ? { contieneNumeros: true } : null;
  }

  static soloNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]+$/;
    return control.value && !regex.test(control.value) ? { contieneLetras: true } : null;
  }

  static emailFundacionLoyolaValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/;
    return control.value && !regex.test(control.value) ? { dominioInvalido: true } : null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.formCentro.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('maxLength')) {
      if (controlName === 'nombre_centro') {
        return 'El nombre del centro no puede exceder los 50 caracteres.';
      }
      if (controlName === 'direccion_centro') {
        return 'La dirección no puede exceder los 50 caracteres.';
      }
      if (controlName === 'correo_centro') {
        return 'El correo no puede exceder los 255 caracteres.';
      }
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'cp') {
        return 'El código postal debe contener 5 dígitos.';
      }
      if (controlName === 'telefono_centro') {
        return 'El teléfono debe contener 9 dígitos.';
      }
    }
    if (control?.hasError('contieneNumeros')) {
      if (controlName === 'nombre_centro') {
        return 'El nombre del centro no puede contener números.';
      }
      if (controlName === 'nombre_localidad') {
        return 'El nombre de la localidad no puede contener números.';
      }
    }
    if (control?.hasError('contieneLetras')) {
      if (controlName === 'telefono_centro') {
        return 'El teléfono solo puede contener números.';
      }
      if (controlName === 'cp') {
        return 'El código postal solo puede contener números.';
      }
    }
    if (control?.hasError('dominioInvalido')) {
      return 'El correo debe pertenecer al dominio @fundacionloyola.es.';
    }

    return '';
  }

  guardarCambiosCentro(): void {
    if (this.formCentro.invalid) {
      this.toastr.warning('Por favor, completa todos los campos correctamente.', 'Advertencia');
      return;
    }

    const datosModificados = this.formCentro.value;

    // Validar que nombre_localidad coincida con el CP
    this.centrosService.validarLocalidad(datosModificados.nombre_localidad, datosModificados.cp).subscribe(response => {
      if (!response.success) {
        this.toastr.warning('El código postal no coincide con la localidad.', 'Advertencia');
        return;
      }

      // Llamar al servicio para guardar los cambios
      this.centrosService.modificarCentro(this.centroSeleccionado.correo_centro, datosModificados).subscribe(response => {
        if (response.success) {
          this.toastr.success('Centro modificado con éxito', 'Éxito');
          setTimeout(() => {
            this.cerrarFormulario();
          }, 1000);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          this.toastr.warning(response.message, 'Advertencia');
        }
      }, error => {
        this.toastr.error('Error al comunicarse con el servidor.', 'Error');
      });
    }, error => {
      this.toastr.error('Error al validar la localidad.', 'Error');
    });
  }

  cerrarFormulario(): void {
    const modalElement = document.getElementById('modificarCentroModal');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}