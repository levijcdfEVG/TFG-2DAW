import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

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
      lugar_imparticion: [this.formacionData?.lugar_imparticion || '', Validators.required],
      modalidad: [this.formacionData?.modalidad || '', Validators.required],
      duracion: [this.formacionData?.duracion || '', Validators.required],
      justificacion: [this.formacionData?.justificacion || ''],
      metodologia: [this.formacionData?.metodologia || ''],
      docentes: [this.formacionData?.docentes || ''],
      dirigido_a: [this.formacionData?.dirigido_a || ''],
      curso_academico: [this.formacionData?.curso_academico || '', [Validators.required, Validators.pattern(/^\d{4}\/\d{2}$/)]],
      modulos: this.fb.array([]),
      objetivos: this.fb.array([]),
      centro_id: [this.formacionData?.centro_id || '', Validators.required],
    });

    if (this.formacionData?.modulos) {
      this.formacionData.modulos.forEach((m: any) =>
          this.modulos.push(this.fb.control(m, Validators.required))
      );
    } else {
      this.addModulo();
    }

    if (this.formacionData?.objetivos) {
      this.formacionData.objetivos.forEach((o: any) =>
          this.objetivos.push(this.fb.control(o, Validators.required))
      );
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

  submit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
