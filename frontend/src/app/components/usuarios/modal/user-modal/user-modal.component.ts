import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterContentInit, AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { Subject, takeUntil } from 'rxjs';
import {Province} from "../../../../interfaces/province.interface";
import {Locality} from "../../../../interfaces/locality.interface";
import {Role} from "../../../../interfaces/role.interface";
import {Center} from "../../../../interfaces/center.interface";
import {User} from "../../../../interfaces/user.interface";

@Component({
  selector: 'app-new-user',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit, AfterViewInit {
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;

  userModalForm!: FormGroup;
  provinceData: Province[] = [
    { id: 1, name: 'Álava' },
    { id: 2, name: 'Albacete' },
  ];

  localityData: Locality[] = [
    { id: 1, name: 'Vitoria-Gasteiz' },
    { id: 2, name: 'Almansa' },
  ];

  roleData: Role[] = [
    { id: 1, name: 'Educador' },
    { id: 2, name: 'Director' },
    { id: 3, name: 'Administrador' },
  ];

  centerData: Center[] = [
    { id: 1, name: 'Centro Loyola Madrid' },
    { id: 2, name: 'Centro Loyola Sevilla' },
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder,
              private userService: UsuarioService,
              private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarFormulario()

    this.loadProvinces();
    this.loadLocalities();
    this.loadRoles();
    this.loadCenters();


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

  ngAfterViewInit() {

  }

// Carga de datos adicionales
  loadProvinces() {}
  loadLocalities() {}
  loadRoles() {}
  loadCenters() {}

  crearFormulario() {
    this.userModalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      surname: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      province: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      role: ['', [Validators.required]],
      center: ['', [Validators.required]],
      new_educator: [{value: false, disabled: true}, [Validators.required]]
    });
  }

  cargarFormulario() {

    this.userModalForm.reset({
      name: '',
      surname: '',
      email: '',
      phone: '',
      province: null,
      locality: null,
      role: null,
      center: null,
      new_educator: false,
    });
  }

  resetForm() {
    this.userModalForm.reset({
      name: '',
      surname: '',
      email: '',
      phone: '',
      province: null,
      locality: null,
      role: null,
      center: null,
      new_educator: false
    });

    this.userModalForm.get('new_educator')?.disable();
  }

  validarCampos(field: string): any {
    const control = this.userModalForm.get(field);

    if (control?.touched && control?.errors) {
      const errors = Object.keys(control.errors);

      if (control.errors['required']) {
        return 'Campo obligatorio.';
      }

      if (control.errors['minlength']) {
        return `El campo debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }

      if (control.errors['email']) {
        return 'Este campo no cumple con el formato de correo';
      }

      if (control.errors['pattern']) {
        return 'Formato inválido';
      }
    }

    return false;
  }

  saveForm() {
    if (this.userModalForm.invalid) {
      Object.values(this.userModalForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.guardarUsuario();

    this.closeModal();
    this.resetForm();
  }

  guardarUsuario() {
    const userData = {
      nombre: this.userModalForm.value.name,
      apellidos: this.userModalForm.value.surname,
      email: this.userModalForm.value.email,
      telefono: this.userModalForm.value.phone,
      provincia: this.userModalForm.value.province,
      localidad: this.userModalForm.value.locality,
      rol: this.userModalForm.value.role,
      centro: this.userModalForm.value.center,
      nuevo_educador: this.userModalForm.value.new_educator
    };

    // this.userService.createUser(userData).pipe(takeUntil(this.unsubscribe$)).subscribe({
    //   next: (response: any) => {
    //     console.log('Usuario guardado:', response);
    //   },
    //   error: (error: any) => {
    //     console.error('Error al guardar el usuario:', error);
    //   }
    // });
  }

  closeModal() {
    this.closeModalBtn.nativeElement.click();
  }
}
