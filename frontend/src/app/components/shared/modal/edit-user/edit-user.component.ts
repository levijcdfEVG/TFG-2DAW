import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { CentrosService } from 'src/app/services/centros.service';
import { RoleService } from "../../../../services/role.service";
import { Role } from "../../../../interfaces/role.interface";
import { Center } from "../../../../interfaces/center.interface";
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  @Input() userData: any;

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
    this.loadRoles();
    this.loadCenters();

    // Suscripción al cambio de rol para habilitar/deshabilitar el checkbox de nuevo educador
    this.userModalForm.get('role')?.valueChanges.subscribe(roleId => { 
      const educadorControl = this.userModalForm.get('new_educator');
      if (roleId === 1) {
        educadorControl?.enable();
      } else {
        educadorControl?.disable();
        educadorControl?.setValue(false);
      }
    });

    // Asegura que el control esté deshabilitado por defecto si el rol no es educador
    if (this.userModalForm.get('role')?.value !== 1) {
      this.userModalForm.get('new_educator')?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.crearFormulario();
      this.cargarFormulario();
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
        console.error('Error al obtener centros:', error);
      }
    });
  }
  
// METODOS DEL FORMULARIO ---------------------------------------
  /**
   * Crea el formulario con sus validaciones
   */
  crearFormulario() {
    this.userModalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), EditUserComponent.onlyCharactersValidator]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), EditUserComponent.onlyCharactersValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[_A-Za-z0-9\-+]+(\.[_A-Za-z0-9-]+)*@fundacionloyola\.net$/), Validators.maxLength(70), EditUserComponent.emailFundacionLoyolaValidator]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$'), Validators.minLength(9), Validators.maxLength(9), EditUserComponent.onlyNumberValidator]],
      role: ['', [Validators.required]],
      center: ['', [Validators.required]],
      new_educator: [{value: false, disabled: true}, [Validators.required]]
    });
  }

  cargarFormulario() {
    // Si tenemos datos del usuario, los cargamos en el formulario
    if (this.userData) {
      this.userModalForm.setValue({
        name: this.userData.nombre_user,
        surname: this.userData.apellido_user,
        email: this.userData.correo_user,
        phone: this.userData.telefono_user,
        role: this.userData.id_rol,
        center: this.userData.id_centro,
        new_educator: this.userData.nuevo_educador
      });
    }
  }

  /**
   * Resetea el formulario a sus valores iniciales
   */
  resetForm() {
    this.userModalForm.reset({
      name: this.userData.nombre_user,
      surname: this.userData.apellido_user,
      email: this.userData.correo_user,
      phone: this.userData.telefono_user,
      role: this.userData.id_rol,
      center: this.userData.id_centro,
      new_educator: this.userData.nuevo_educador
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
    this.updateUser();
  }
  /**
   * Actualiza los datos del usuario en el backend
   * Envía los datos del formulario al servicio para actualizar el usuario
   * Muestra mensajes de éxito o error según corresponda
   */
  updateUser() {

    const userData = {
      id: this.userData.id,
      nombre_user: this.userModalForm.value.name,
      apellido_user: this.userModalForm.value.surname,
      correo_user: this.userModalForm.value.email,
      telefono_user: this.userModalForm.value.phone,
      id_rol: this.userModalForm.value.role,
      id_centro: this.userModalForm.value.center,
      nuevo_educador: this.userModalForm.value.new_educator,
      estado: this.userData.estado
    };
    console.log(userData);

    this.userService.updateUser(userData).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        this.toastr.success('Usuario actualizado con éxito', 'Éxito');
        this.closeModal(); // Cerramos primero el modal
        setTimeout(() => {
          this.userService.notificarCambio(); // Y luego notificamos el cambio
        }, 100);
      },
      error: (error: any) => {
        console.error('Error al actualizar el usuario:', error);
        this.toastr.error('Error al actualizar el usuario', 'Error');
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
