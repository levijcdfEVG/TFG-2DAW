import { Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

/**
 * Componente que permite modificar los datos de un centro existente.
 */
@Component({
  selector: 'app-modificar-centro',
  templateUrl: './modificar-centro.component.html',
  styleUrls: ['./modificar-centro.component.css']
})
export class ModificarCentroComponent implements OnInit, OnChanges {

    /** Objeto con los datos del centro que ha sido seleccionado para modificar */
  @Input() centroSeleccionado: any = {};

  /** Formulario reactivo con los campos del centro */
  formCentro!: FormGroup;

    /**
   * Constructor del componente.
   * @param fb FormBuilder para crear el formulario
   * @param centrosService Servicio para gestión de centros
   * @param toastr Servicio de notificaciones
   * @param router Servicio de navegación
   * @param sharedService Servicio compartido para obtener datos globales
   */
  constructor(
    private fb: FormBuilder,
    private centrosService: CentrosService,
    private toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService
  ) {}

    /**
   * Inicializa el formulario con los datos del centro seleccionado y configura validadores.
   */
  ngOnInit(): void {
    const rol = this.sharedService.getIdRol();
    console.log('Rol del usuario:', rol);

    this.formCentro = this.fb.group({
      nombre_centro: ['', [
        Validators.required,
        Validators.maxLength(50),
        ModificarCentroComponent.sinNumerosValidator
      ]],
      direccion_centro: ['', [
        Validators.required,
        Validators.maxLength(50)
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
        Validators.maxLength(255),
        ModificarCentroComponent.emailFundacionLoyolaValidator
      ]]
    });

    this.formCentro.patchValue(this.centroSeleccionado);
  }

    /**
   * Se ejecuta cuando cambian las propiedades de entrada del componente.
   * @param changes Cambios detectados en las propiedades @Input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['centroSeleccionado'] && this.centroSeleccionado) {
      this.formCentro.patchValue(this.centroSeleccionado);
      this.formCentro.markAsPristine(); // asegúrate de que se vea como limpio inicialmente
    }
  }

  /**
   * Validador personalizado para evitar números en el texto.
   * @param control Control del formulario
   * @returns Error si contiene números, o null si es válido
   */
  static sinNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/;
    return control.value && !regex.test(control.value) ? { contieneNumeros: true } : null;
  }

    /**
   * Validador personalizado para permitir solo números.
   * @param control Control del formulario
   * @returns Error si contiene letras, o null si es válido
   */
  static soloNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]+$/;
    return control.value && !regex.test(control.value) ? { contieneLetras: true } : null;
  }

    /**
   * Valida que el correo pertenezca al dominio fundacionloyola.es.
   * @param control Control del formulario
   * @returns Error si el dominio es inválido, o null si es válido
   */
  static emailFundacionLoyolaValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/;
    return control.value && !regex.test(control.value) ? { dominioInvalido: true } : null;
  }

    /**
   * Devuelve el mensaje de error personalizado para un control del formulario.
   * @param controlName Nombre del control del formulario
   * @returns Mensaje de error
   */
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

    /**
   * Guarda los cambios realizados al centro, validando primero el formulario y luego el código postal con la localidad.
   */
  guardarCambiosCentro(): void {
    if (this.formCentro.invalid) {
      this.toastr.warning('Por favor, completa todos los campos correctamente.', 'Advertencia');
      return;
    }

    const datosModificados = this.formCentro.value;


    this.centrosService.validarLocalidad(datosModificados.nombre_localidad, datosModificados.cp).subscribe(response => {
      if (!response.success) {
        this.toastr.warning('El código postal no coincide con la localidad.', 'Advertencia');
        return;
      }


      this.centrosService.modificarCentro(this.centroSeleccionado.correo_centro, datosModificados).subscribe(response => {
        if (response.success) {
          this.toastr.success('Centro modificado con éxito', 'Éxito');
          console.log('Confirmar rol:', this.sharedService.getIdRol());
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

    /**
   * Cierra el modal de edición del centro si está abierto.
   */
  cerrarFormulario(): void {
    const modalElement = document.getElementById('modificarCentroModal');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}