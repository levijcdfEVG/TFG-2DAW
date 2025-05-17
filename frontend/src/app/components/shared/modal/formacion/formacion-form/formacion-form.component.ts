import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-formacion-form',
  templateUrl: './formacion-form.component.html',
})
export class FormacionFormComponent implements OnInit {

  @Input() formacionData?: any;
  @Output() formSubmit = new EventEmitter<any>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      lugar_imparticion: [this.formacionData?.lugar_imparticion || '', [Validators.required, Validators.maxLength(60)]],
      modalidad: [this.formacionData?.modalidad || '', [Validators.required, Validators.maxLength(20)]],
      duracion: [this.formacionData?.duracion || '', [Validators.required, Validators.min(1)], Validators.maxLength(255)],
      justificacion: [this.formacionData?.justificacion || '', [Validators.required, Validators.maxLength(255)]],
      metodologia: [this.formacionData?.metodologia || '', [Validators.required, Validators.maxLength(255)]],
      docentes: [this.formacionData?.docentes || '', [Validators.required, Validators.maxLength(255)]],
      dirigido_a: [this.formacionData?.dirigido_a || '', [Validators.required, Validators.maxLength(255)]],
      curso_academico: [this.formacionData?.curso_academico || '', [Validators.required, Validators.pattern(/^\d{4}\/\d{2}$/)]],
      modulos: this.fb.array([]),
      objetivos: this.fb.array([]),
      centro_id: [this.formacionData?.centro_id || '', [Validators.min(1)]],
    });

    if (this.formacionData?.modulos?.length) {
      this.formacionData.modulos.forEach((m: string) => this.modulos.push(this.fb.control(m, [Validators.required, Validators.maxLength(50)])));
    } else {
      this.addModulo();
    }

    if (this.formacionData?.objetivos?.length) {
      this.formacionData.objetivos.forEach((o: string) => this.objetivos.push(this.fb.control(o, [Validators.required, Validators.maxLength(150)])));
    } else {
      this.addObjetivo();
    }
  }

  get modulos(): FormArray {
    return this.form.get('modulos') as FormArray;
  }

  get objetivos(): FormArray {
    return this.form.get('objetivos') as FormArray;
  }

  addModulo() {
    this.modulos.push(this.fb.control('', Validators.required));
  }

  addObjetivo() {
    this.objetivos.push(this.fb.control('', Validators.required));
  }

  removeModulo(index: number) {
    this.modulos.removeAt(index);
  }

  removeObjetivo(index: number) {
    this.objetivos.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched(); // para mostrar errores
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control.hasError('min')) {
      return 'El valor debe ser mayor que cero.';
    }
    if (control.hasError('maxlength')) {
      return 'El texto es demasiado largo.';
    }
    if (control.hasError('pattern')) {
      if (controlName === 'curso_academico') {
        return 'El formato debe ser AAAA/AA (ejemplo: 2024/25).';
      }
      return 'Formato inválido.';
    }
    return '';
  }
}
