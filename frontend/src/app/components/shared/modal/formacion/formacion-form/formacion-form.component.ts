import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import {CentrosService} from "../../../../../services/centros.service";
import {FormacionService} from "../../../../../services/formacion.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-formacion-form',
  templateUrl: './formacion-form.component.html',
})
export class FormacionFormComponent implements OnInit ,OnDestroy{

  @Input() formacionData?: any;
  @Input() esEditar?: boolean;
  @Output() formSubmit = new EventEmitter<any>();
  public centros: any[] = [];
  public centroSeleccionado: any = null;
  public form!: FormGroup;
  // @ts-ignore
  public loadingCentros: boolean;
  public loadingFormacionAEditar: boolean = false;

  constructor(
      private fb: FormBuilder,
      private centrosService: CentrosService,
      private cdr: ChangeDetectorRef,
      private formacionService: FormacionService,
      private toastr: ToastrService ) {}

  ngOnInit(): void {
    this.loadCentros();
    if (this.esEditar) {
      this.loadFormacionAEditar();
      this.form = this.fb.group({
        id: [this.formacionData?.id || ''],
        lugar_imparticion: [this.formacionData?.lugar_imparticion || '', [Validators.required, Validators.maxLength(60)]],
        modalidad: [this.formacionData?.modalidad || '', [Validators.required, Validators.maxLength(20)]],
        duracion: [this.formacionData?.duracion || '', [Validators.required, Validators.min(1), Validators.maxLength(255)]],
        justificacion: [this.formacionData?.justificacion || '', [Validators.required, Validators.maxLength(255)]],
        metodologia: [this.formacionData?.metodologia || '', [Validators.required, Validators.maxLength(255)]],
        docentes: [this.formacionData?.docentes || '', [Validators.required, Validators.maxLength(255)]],
        dirigido_a: [this.formacionData?.dirigido_a || '', [Validators.required, Validators.maxLength(255)]],
        curso_academico: [this.formacionData?.curso_academico || '', [Validators.required, Validators.pattern(/^\d{4}\/\d{2}$/)]],
        modulos: this.fb.array([]),
        objetivos: this.fb.array([]),
        centro_id: [this.formacionData?.centro_id, [Validators.min(1)]],
      });

    }else {
      this.form = this.fb.group({
        lugar_imparticion: ['', [Validators.required, Validators.maxLength(60)]],
        modalidad: ['', [Validators.required, Validators.maxLength(20)]],
        duracion: ['', [Validators.required, Validators.min(1), Validators.maxLength(255)]],
        justificacion: ['', [Validators.required, Validators.maxLength(255)]],
        metodologia: ['', [Validators.required, Validators.maxLength(255)]],
        docentes: ['', [Validators.required, Validators.maxLength(255)]],
        dirigido_a: ['', [Validators.required, Validators.maxLength(255)]],
        curso_academico: ['', [Validators.required, Validators.pattern(/^\d{4}\/\d{2}$/)]],
        modulos: this.fb.array([]),
        objetivos: this.fb.array([]),
        centro_id: [this.formacionData?.centro_id || '', [Validators.required]],
      });
    }



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

  ngOnDestroy() {

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
      const payload = {
        formacion: {
          lugar_imparticion: this.form.value.lugar_imparticion,
          modalidad: this.form.value.modalidad,
          duracion: this.form.value.duracion,
          justificacion: this.form.value.justificacion,
          metodologia: this.form.value.metodologia,
          docentes: this.form.value.docentes,
          dirigido_a: this.form.value.dirigido_a,
          activo: 1
        },
        modulos: (this.form.value.modulos as string[]).map((nombre: string) => ({ nombre_modulo: nombre })),
        objetivos: (this.form.value.objetivos as string[]).map((desc: string) => ({ descripcion: desc })),
        centros: this.form.value.centro_id,
        cursos: [this.form.value.curso_academico]
      };
      this.formSubmit.emit(payload);
    } else {
      this.form.markAllAsTouched();
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

  evaluarCantidadModulos() {
    const modulos = this.form.get('modulos') as FormArray;
    return modulos.length > 1;
  }

  evaluarCantidadObjetivos() {
    const objetivos = this.form.get('objetivos') as FormArray;
    return objetivos.length > 1;
  }

  private loadCentros() {
    this.loadingCentros = true;
    this.centrosService.getCentros().subscribe({
      next: (centros) => {
        this.centros = centros.data;
        this.loadingCentros = false;
      },
      error: () => (this.loadingCentros = false)
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }


  private loadFormacionAEditar() {
    this.loadingFormacionAEditar = true;
    this.formacionService.getFormacionAEditar().subscribe({
      next: (formacion) => {
        this.formacionData = formacion;
        this.form.patchValue(this.formacionData);
        this.loadCentros();
        this.loadingFormacionAEditar = false;
        console.log("Valores fetcheados",this.formacionData);
        console.log("Valores del form",this.form.value);
      },
      error: () => (this.loadingCentros = false)
    });
  }
}
