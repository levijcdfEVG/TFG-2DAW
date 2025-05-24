import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {CentrosService} from "../../../../../services/centros.service";
import {FormacionService} from "../../../../../services/formacion.service";
import {ToastrService} from "ngx-toastr";
import Swal2 from "sweetalert2";

@Component({
  selector: 'app-formacion-form',
  templateUrl: './formacion-form.component.html',
})
export class FormacionFormComponent implements OnInit{

  @Input() formacionData?: any | null;
  @Input() esEditar?: boolean;
  @Output() formSubmit = new EventEmitter<any>();
  public centros: any[] = [];
  public form!: FormGroup;
  // @ts-ignore
  public loadingCentros: boolean;
  public loadingFormacionAEditar: boolean = false;

  constructor(
      private fb: FormBuilder,
      private centrosService: CentrosService,
      private formacionService: FormacionService
  ) {}

  ngOnInit(): void {
    this.loadCentros();
    if (this.esEditar) {
      this.form = this.fb.group({
        id: [this.formacionData?.id || ''],
        lugar_imparticion: [this.formacionData?.lugar_imparticion || '', [Validators.required, Validators.maxLength(60)]],
        modalidad: [this.formacionData?.modalidad || '', [Validators.required, Validators.maxLength(20)]],
        duracion: [this.formacionData?.duracion || '', [Validators.required, Validators.min(1), Validators.maxLength(255)]],
        justificacion: [this.formacionData?.justificacion || '', [Validators.required, Validators.maxLength(255)]],
        metodologia: [this.formacionData?.metodologia || '', [Validators.required, Validators.maxLength(255)]],
        docentes: [this.formacionData?.docentes || '', [Validators.required, Validators.maxLength(255)]],
        dirigido_a: [this.formacionData?.dirigido_a || '', [Validators.required, Validators.maxLength(255)]],
        curso_inicio: ['', [Validators.required, Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
        curso_fin: ['', [Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
        modulos: this.fb.array([]),
        objetivos: this.fb.array([]),
        centro_id: [this.formacionData?.centro?.id, [Validators.required]],
      });
      this.loadFormacionAEditar();
    }else {
      this.form = this.fb.group({
        lugar_imparticion: ['', [Validators.required, Validators.maxLength(60)]],
        modalidad: ['', [Validators.required, Validators.maxLength(20)]],
        duracion: ['', [Validators.required, Validators.min(1), Validators.maxLength(255)]],
        justificacion: ['', [Validators.required, Validators.maxLength(255)]],
        metodologia: ['', [Validators.required, Validators.maxLength(255)]],
        docentes: ['', [Validators.required, Validators.maxLength(255)]],
        dirigido_a: ['', [Validators.required, Validators.maxLength(255)]],
        curso_inicio: ['', [Validators.required, Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
        curso_fin: ['', [Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
        modulos: this.fb.array([]),
        objetivos: this.fb.array([]),
        centro_id: ['', [Validators.required]],
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


  get modulos(): FormArray {
    return this.form.get('modulos') as FormArray;
  }

  get objetivos(): FormArray {
    return this.form.get('objetivos') as FormArray;
  }

  get cursoFinalInvalido(): false | true | undefined {
    return this.form.hasError('cursoFinalNoPosterior') &&
        this.form.get('curso_inicio')?.touched &&
        this.form.get('curso_fin')?.touched;
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

  protected evaluarObjetivosUnicos(): boolean {
    const valores = this.objetivos.controls.map(c => c.value);
    const valoresUnicos = valores.filter((v, i) => valores.indexOf(v) === i);
    return valoresUnicos.length === valores.length;
  }

  protected evaluarModulosUnicos(): boolean {
    const valores = this.modulos.controls.map(c => c.value);
    const valoresUnicos = valores.filter((v, i) => valores.indexOf(v) === i);
    return valoresUnicos.length === valores.length;
  }


  submit() {
    if (!this.isCursoFinalValido()) {
      this.form.get('curso_fin')?.setErrors({ cursoFinalNoPosterior: true });
      this.form.get('curso_fin')?.markAsTouched();
      return;
    } else {
      this.form.get('curso_fin')?.setErrors(null);
    }

    if (this.form.valid) {
      if (!this.evaluarObjetivosUnicos() || !this.evaluarModulosUnicos()) {
        Swal2.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Los objetivos y módulos deben ser únicos',
        })
        return;
      }

      const payload = {
        id: this.form.value.id,
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
        curso_inicio: [this.form.value.curso_inicio],
        curso_fin: [this.form.value.curso_fin]
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
      if (controlName === 'curso-inicio' || controlName === 'curso_fin') {
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


  private loadFormacionAEditar() {
    this.loadingFormacionAEditar = true;
    this.formacionService.getFormacionAEditar().subscribe({
      next: (formacion) => {
        if (!formacion) {
          this.loadingFormacionAEditar = false;
          return;  // No haces patch si no hay datos
        }
        this.formacionData = formacion;

        // Aquí ya tienes los datos: parcheas el form
        this.form.patchValue(this.formacionData);
        this.form.patchValue({ curso_inicio: this.formacionData.cursos[0], curso_fin: this.formacionData.cursos[1] || null,  centro_id: this.formacionData.centro?.id || null });

        this.loadingFormacionAEditar = false;
      },
      error: () => {
        this.loadingFormacionAEditar = false;
        // Opcional: mostrar error
      }
    });
  }


  public clearForm() {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  public isCursoFinalValido(): boolean {
    const inicio = this.form.get('curso_inicio')?.value;
    const fin = this.form.get('curso_fin')?.value;

    if (!inicio || !fin) return true;

    const [inicioAnioCompleto, inicioAnioCorto] = inicio.split('/');
    const [finAnioCompleto, finAnioCorto] = fin.split('/');

    if (!inicioAnioCompleto || !inicioAnioCorto || !finAnioCompleto || !finAnioCorto) return true;

    const inicioAnioCompNum = parseInt(inicioAnioCompleto);
    const finAnioCompNum = parseInt(finAnioCompleto);

    const inicioAnioCortoNum = parseInt(inicioAnioCorto);
    const finAnioCortoNum = parseInt(finAnioCorto);

    if (
        isNaN(inicioAnioCompNum) || isNaN(finAnioCompNum) ||
        isNaN(inicioAnioCortoNum) || isNaN(finAnioCortoNum)
    ) return true;

    if (finAnioCompNum <= inicioAnioCompNum) return false;  // El año completo final debe ser mayor

    // La diferencia de años cortos debe ser igual a la diferencia de años completos
    const diffCompleto = finAnioCompNum - inicioAnioCompNum;
    const diffCorto = finAnioCortoNum - inicioAnioCortoNum;

    if (diffCorto !== diffCompleto) return false;

    return true;
  }

}
