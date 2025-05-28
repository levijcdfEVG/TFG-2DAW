import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { CentrosService } from 'src/app/services/centros.service';
import { RoleService } from "../../../../services/role.service";
import { Role } from "../../../../interfaces/role.interface";
import { Center } from "../../../../interfaces/center.interface";
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;

  userModalForm!: FormGroup;
  
  roleData: Role[] = [];
  centerData: Center[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder,
              private userService: UsuarioService,
              private roleService: RoleService,
              private centerService: CentrosService,
              private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarFormulario();

    this.loadRoles();
    this.loadCenters();

    // Suscripción al cambio de rol para habilitar/deshabilitar el checkbox de nuevo educador
    this.userModalForm.get('role')?.valueChanges.subscribe(roleId => { 
      const educadorControl = this.userModalForm.get('new_educator');
      if (roleId === 1) {
        educadorControl?.enable();
      } else {
        educadorControl?.disable();
        educadorControl?.setValue(false); // Limpia el checkbox si se deshabilita
      }
    });

    // Asegura que el control esté deshabilitado por defecto si el rol no es educador
    if (this.userModalForm.get('role')?.value !== 1) {
      this.userModalForm.get('new_educator')?.disable();
    }
  }

// CARGA DE DATOS ---------------------------------------
  /**
   * Carga los roles desde el servicio y los almacena en roleData
   */
  loadRoles() {
    this.roleService.getAllRoles().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: Role[]) => {
        this.roleData = response;
      },
      error: (error: any) => {
        console.error('Error al obtener roles:', error);
      }
    });
  }

  /**
   * Carga los centros desde el servicio y los almacena en centerData
   */
  loadCenters() {
    this.centerService.getCentros().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response) => {
        this.centerData = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener roles:', error);
      }
    });
  }
  
// METODOS DEL FORMULARIO ---------------------------------------
  /**
   * Crea el formulario con sus validaciones
   */
  crearFormulario() {
    this.userModalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), UserModalComponent.onlyCharactersValidator]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), UserModalComponent.onlyCharactersValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[_A-Za-z0-9\-+]+(\.[_A-Za-z0-9-]+)*@fundacionloyola\.net$/), Validators.maxLength(70), UserModalComponent.emailFundacionLoyolaValidator]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$'), Validators.minLength(9), Validators.maxLength(9), UserModalComponent.onlyNumberValidator]],
      role: ['', [Validators.required]],
      center: ['', [Validators.required]],
      new_educator: [{value: false, disabled: true}, [Validators.required]]
    });
  }

  /**
   * Inicializa el formulario con valores vacíos
   */
  cargarFormulario() {
    this.userModalForm.setValue({
      name: '',
      surname: '',
      email: '',
      phone: '',
      role: null,
      center: null,
      new_educator: false,
    });
  }

  /**
   * Resetea el formulario a sus valores iniciales
   */
  resetForm() {
    this.userModalForm.reset({
      name: '',
      surname: '',
      email: '',
      phone: '',
      role: null,
      center: null,
      new_educator: false
    });

    this.userModalForm.get('new_educator')?.disable();
  }

  /**
   * Valida los campos del formulario y retorna mensajes de error
   * @param field - Nombre del campo a validar
   * @returns Mensaje de error o false si no hay errores
   */
  validarCampos(field: string): any {
    const control = this.userModalForm.get(field);
  
    if (control?.touched && control?.errors) {
      const errors = Object.keys(control.errors);
  
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
  
      if (control.errors['minlength']) {
        return `El campo debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
  
      if (control.errors['maxlength']) {
        return `El campo no puede tener más de ${control.errors['maxlength'].requiredLength} caracteres`;
      }
  
      if (control.errors['hasNumbers']) {
        return 'Este campo no puede contener números';
      }
  
      if (control.errors['hasCharacters']) {
        return 'Este campo solo puede contener números';
      }
  
      if (control.errors['invalidDomain']) {
        return 'El correo electrónico debe ser de dominio @fundacionloyola.net';
      }
  
      if (control.errors['pattern']) {
        if (field === 'phone') {
          return 'El teléfono debe contener exactamente 9 dígitos';
        }
        return 'Formato inválido';
      }
    }
    return false;
  }

  // Validador de campos sin números
  static onlyCharactersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚüÜñÑ.,-]+$/;
    return control.value && !regex.test(control.value) ? { hasNumbers: true } : null;
  }

  // Validador de campos con solo números
  static onlyNumberValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[0-9]+$/;
    return control.value && !regex.test(control.value) ? { hasCharacters: true } : null;
  }

  // Validador de correo electrónico
  static emailFundacionLoyolaValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@fundacionloyola\.net$/;
    return control.value && !regex.test(control.value) ? { invalidDomain: true } : null;
  }

  /**
   * Guarda el formulario si es válido
   * Marca todos los campos como touched si el formulario es inválido
   */
  saveForm() {

    if (this.userModalForm.invalid) {
      Object.values(this.userModalForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.createUser();
  }

  /**
   * Guarda los datos del usuario en el backend
   */
  createUser() {

    const userData = {
      nombre_user: this.userModalForm.value.name,
      apellido_user: this.userModalForm.value.surname,
      correo_user: this.userModalForm.value.email,
      telefono_user: this.userModalForm.value.phone,
      id_rol: this.userModalForm.value.role,
      id_centro: this.userModalForm.value.center,
      nuevo_educador: this.userModalForm.value.new_educator,
      estado: 1
    };

    this.userService.createUser(userData).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        this.toastr.success('Usuario creado con éxito', 'Éxito');
        this.userService.notificarCambio();
        setTimeout(() => {
          this.closeModal();
          this.resetForm();
        }, 100);
      },
      error: (error: any) => {
        console.error('Error al guardar el usuario:', error);
        this.toastr.error('Error al crear el usuario', 'Error');
      }
    });
  }

  /**
   * Cierra el modal usando el botón de cierre
   */
  closeModal() {
    if (this.closeModalBtn) {
      this.closeModalBtn.nativeElement.click();
    }
  }
}
