import { ProvinciaService } from '../../../../services/province.service';
import { LocalidadService } from '../../../../services/locality.service';
import {Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { Subject, takeUntil } from 'rxjs';
import {Province} from "../../../../interfaces/province.interface";
import {Locality} from "../../../../interfaces/locality.interface";
import {Role} from "../../../../interfaces/role.interface";
import {Center} from "../../../../interfaces/center.interface";
import {RoleService} from "../../../../services/role.service";

@Component({
  selector: 'app-new-user',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;

  userModalForm!: FormGroup;
  provinceData: Province[] = [];

  localityData: Locality[] = [];

  roleData: Role[] = [];

  centerData: Center[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder,
              private userService: UsuarioService,
              private roleService: RoleService,
              private localityService: LocalidadService,
              private provinceService: ProvinciaService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarFormulario();

    // this.loadProvinces();
    // this.loadLocalities();
    // this.loadRoles();
    // this.loadCenters();

    this.userModalForm.get('role')?.valueChanges.subscribe(roleId => {
      const educadorControl = this.userModalForm.get('new_educator');
      if (roleId === 2) {
        educadorControl?.enable();
      } else {
        educadorControl?.disable();
        educadorControl?.setValue(false); // Limpia el checkbox si se deshabilita
      }
    });

    // Asegura que el control esté deshabilitado por defecto si el rol no es educador
    if (this.userModalForm.get('role')?.value !== 2) {
      this.userModalForm.get('new_educator')?.disable();
    }
  }


// Carga de datos adicionales
  loadProvinces() {
    this.provinceService.getAllProvinces().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: Province[]) => {
        this.provinceData = response;
        // console.log(this.provinceData);
      },
      error: (error: any) => {
        console.error('Error al obtener las localidades:', error);
      }

    });

  }

  loadLocalities() {
    this.localityService.getAllLocalities().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: Locality[]) => {
        this.localityData = response;
        // console.log(this.localityData);
      },
      error: (error: any) => {
        console.error('Error al obtener las localidades:', error);
      }

    });
  }

  loadRoles() {

    this.roleService.getAllRoles().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: Role[]) => {
        this.roleData = response;
        // console.log(this.roleData);
      },
      error: (error: any) => {
        console.error('Error al obtener roles:', error);
      }

    });
  }
  loadCenters() {}

  crearFormulario() {
    this.userModalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(/^[_A-Za-z0-9\-+]+(\.[_A-Za-z0-9-]+)*@fundacionloyola\.es$/)]],
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
      nombre_user: this.userModalForm.value.name,
      apellido_user: this.userModalForm.value.surname,
      correo_user: this.userModalForm.value.email,
      telefono_user: this.userModalForm.value.phone,
      id_rol: this.userModalForm.value.role,
      nuevo_educador: this.userModalForm.value.new_educator,
      estado: 1
    };

    this.userService.createUser(userData).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        console.log('Usuario guardado:', response);
      },
      error: (error: any) => {
        console.error('Error al guardar el usuario:', error);
      }
    });
  }


  closeModal() {
    if (this.closeModalBtn) {
      this.closeModalBtn.nativeElement.click();
    }
  }
}
