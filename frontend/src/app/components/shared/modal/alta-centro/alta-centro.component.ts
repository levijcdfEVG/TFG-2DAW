import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import { CentrosService } from 'src/app/services/centros.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


/**
 * Componente para el alta de centros.
 * Permite crear un nuevo centro validando su información antes de enviarla al backend.
 */
@Component({
  selector: 'app-alta-centro',
  templateUrl: './alta-centro.component.html',
  styleUrls: ['./alta-centro.component.css']
})
export class AltaCentroComponent {

  /** Formulario reactivo del centro */
  formCentro!: FormGroup;

  /** Evento que se emite para refrescar la lista de centros */
  @Output() refreshLista = new EventEmitter<any>();

    /**
   * Constructor del componente
   * @param fb FormBuilder para construir el formulario reactivo
   * @param centrosService Servicio para operaciones relacionadas con centros
   * @param toastr Servicio de notificaciones
   * @param cdr Referencia para detección de cambios
   */
  constructor(private fb: FormBuilder,
              private centrosService: CentrosService,
              private toastr: ToastrService,
              private cdr: ChangeDetectorRef
  ) {}

/** Modelo que representa un nuevo centro */
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

  /** Fuente de datos (a futuro se puede usar para mostrar datos en una tabla u otro componente) */
  dataSource: any[] = [];

   /**
   * Devuelve el mensaje de error correspondiente a un control del formulario.
   * @param controlName Nombre del control
   * @returns Mensaje de error en texto plano
   */
  getErrorMessage(controlName: string): string {
    const control = this.formCentro.get(controlName);
  
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('maxlength')) {
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
   * Validador personalizado: valida que el campo no contenga números.
   * @param control Control del formulario
   * @returns Objeto de error si contiene números, o null si es válido
   */
  static sinNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/;
    return control.value && !regex.test(control.value) ? { contieneNumeros: true } : null;
  }

  /**
   * Validador personalizado: valida que el campo solo contenga números.
   * @param control Control del formulario
   * @returns Objeto de error si contiene letras, o null si es válido
   */
  static soloNumerosValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]+$/;
    return control.value && !regex.test(control.value) ? { contieneLetras: true } : null;
  }

  /**
   * Validador personalizado: verifica si el correo pertenece al dominio fundacionloyola.es.
   * @param control Control del formulario
   * @returns Objeto de error si el dominio no es válido, o null si es válido
   */
  static emailFundacionLoyolaValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.es$/;
    return control.value && !regex.test(control.value) ? { dominioInvalido: true } : null;
  }

    /**
   * Inicializa el formulario reactivo y escucha cambios para actualizar el modelo `nuevoCentro`.
   */
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

  this.formCentro.valueChanges.subscribe(values => {
    this.nuevoCentro = values;
  });
}

  /**
   * Crea un nuevo centro si el formulario es válido y la localidad coincide con el CP.
   * Muestra mensajes de éxito o error según el resultado de la operación.
   */
  crearCentro(): void {

    this.formCentro.patchValue(this.nuevoCentro);
    console.log(this.formCentro.value);
    console.log(this.nuevoCentro);

    

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

    
  
      // Llama para guardar el nuevo centro en el backend
      this.centrosService.crearCentro(this.nuevoCentro).subscribe(response => {
        if (response.success) {
          this.toastr.success('Centro creado con éxito', 'Éxito');
          this.centrosService.notificarCambio(); // Notificar cambio
          this.formCentro.reset();
          setTimeout(() => {
            this.cerrarFormulario();
          }, 1000);
          setTimeout(() => {
            this.refreshLista.emit(true);
          }, 1000);
    
        } else {
          this.toastr.error('Error al crear el centro: ' + response.message, 'Error');
        }
      }, error => {
        this.toastr.error('Error al comunicarse con el servidor.', error);
      });
    }, error => {
      this.toastr.error('Error al validar la localidad.', 'Error');
    });
  }

    /**
   * Cierra el formulario modal si está presente en el DOM.
   */
  cerrarFormulario(): void {
    const modalElement = document.getElementById('altaCentroModal');
  if (modalElement) {
    // Ensure bootstrap is globally available or import it
    const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
    modalInstance.hide();
  }


}
}

