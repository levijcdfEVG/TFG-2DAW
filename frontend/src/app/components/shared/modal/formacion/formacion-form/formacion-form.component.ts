import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CentrosService } from "../../../../../services/centros.service";
import { FormacionService } from "../../../../../services/formacion.service";
import { ToastrService } from "ngx-toastr";
import Swal2 from "sweetalert2";

/**
 * Componente para el formulario de creación/edición de formaciones.
 * @author Levi Josué Candeias de Figueiredo
 * @email levijosuecandeiasdefigueiredo.guadalupe@alumnado.fundacionloyola.net
 */
@Component({
  selector: 'app-formacion-form',
  templateUrl: './formacion-form.component.html',
})
export class FormacionFormComponent implements OnInit {

  /**
   * Datos de la formación a editar.
   */
  @Input() formacionData?: any | null;

  /**
   * Indica si el formulario está en modo edición.
   */
  @Input() esEditar?: boolean;

  /**
   * Evento emitido al enviar el formulario con los datos.
   */
  @Output() formSubmit = new EventEmitter<any>();

  /** Lista de centros disponibles */
  public centros: any[] = [];

  /** Formulario reactivo principal */
  public form!: FormGroup;

  /** Estado de carga de los centros */
  public loadingCentros!: boolean;

  /** Estado de carga de los datos de formación en modo edición */
  public loadingFormacionAEditar: boolean = false;

  /** Cursos disponibles para seleccionar */
  protected cursosDisponibles: string[] = [];

  constructor(
      private fb: FormBuilder,
      private centrosService: CentrosService,
      private formacionService: FormacionService
  ) {}

  /**
   * Inicializa el formulario y carga datos si se está editando.
   */
  ngOnInit(): void {
    this.generateCursos();
    this.loadCentros();
    this.initForm();
    this.populateModulosYObjetivos();
  }

  /**
   * Inicializa el formulario dependiendo de si es edición o creación.
   * @private
   */
  private initForm(): void {
    const baseControls = {
      lugar_imparticion: ['', [Validators.required, Validators.maxLength(60)]],
      modalidad: ['', [Validators.required, Validators.maxLength(100)]],
      duracion: ['', [Validators.required, Validators.min(1), Validators.maxLength(255)]],
      justificacion: ['', [Validators.required, Validators.maxLength(255)]],
      metodologia: ['', [Validators.required, Validators.maxLength(255)]],
      docentes: ['', [Validators.required, Validators.maxLength(255)]],
      dirigido_a: ['', [Validators.required, Validators.maxLength(255)]],
      curso_inicio: ['', [Validators.required, Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
      curso_fin: ['', [Validators.pattern(/^[0-9]{4}\/[0-9]{2}$/)]],
      modulos: this.fb.array([]),
      objetivos: this.fb.array([]),
      centro_id: [null, [Validators.required]],
    };

    if (this.esEditar) {
      this.form = this.fb.group({
        id: [this.formacionData?.id || ''],
        ...baseControls,
        centro_id: [this.formacionData?.centro?.id, [Validators.required]]
      });
      this.loadFormacionAEditar();
    } else {
      this.form = this.fb.group(baseControls);
    }
  }

  /**
   * Añade los módulos y objetivos al formulario si existen o agrega uno vacío.
   * @private
   */
  private populateModulosYObjetivos(): void {
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

  /** Getter de la lista de módulos */
  get modulos(): FormArray {
    return this.form.get('modulos') as FormArray;
  }

  /** Getter de la lista de objetivos */
  get objetivos(): FormArray {
    return this.form.get('objetivos') as FormArray;
  }

  /** Valida si el curso final es posterior al inicial */
  get cursoFinalInvalido(): false | true | undefined {
    return this.form.hasError('cursoFinalNoPosterior') &&
        this.form.get('curso_inicio')?.touched &&
        this.form.get('curso_fin')?.touched;
  }

  /** Añade un nuevo módulo */
  addModulo(): void {
    this.modulos.push(this.fb.control('', Validators.required));
  }

  /** Añade un nuevo objetivo */
  addObjetivo(): void {
    this.objetivos.push(this.fb.control('', Validators.required));
  }

  /**
   * Elimina un módulo por índice
   * @param index Índice del módulo a eliminar
   */
  removeModulo(index: number): void {
    this.modulos.removeAt(index);
  }

  /**
   * Elimina un objetivo por índice
   * @param index Índice del objetivo a eliminar
   */
  removeObjetivo(index: number): void {
    this.objetivos.removeAt(index);
  }

  /**
   * Verifica que todos los objetivos sean únicos.
   * @protected
   */
  protected evaluarObjetivosUnicos(): boolean {
    const valores = this.objetivos.controls.map(c => c.value);
    return new Set(valores).size === valores.length;
  }

  /**
   * Verifica que todos los módulos sean únicos.
   * @protected
   */
  protected evaluarModulosUnicos(): boolean {
    const valores = this.modulos.controls.map(c => c.value);
    return new Set(valores).size === valores.length;
  }

  /**
   * Envia el formulario si es válido y emite el payload estructurado.
   */
  submit(): void {
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
        });
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
        modulos: (this.form.value.modulos as string[]).map(nombre => ({ nombre_modulo: nombre })),
        objetivos: (this.form.value.objetivos as string[]).map(desc => ({ descripcion: desc })),
        centros: this.form.value.centro_id,
        curso_inicio: [this.form.value.curso_inicio],
        curso_fin: [this.form.value.curso_fin]
      };

      this.formSubmit.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Devuelve el mensaje de error correspondiente a un control.
   * @param controlName Nombre del control
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('min')) return 'El valor debe ser mayor que cero.';
    if (control.hasError('maxlength')) return 'El texto es demasiado largo.';
    if (control.hasError('pattern')) {
      if (controlName === 'curso-inicio' || controlName === 'curso_fin') {
        return 'El formato debe ser AAAA/AA (ejemplo: 2024/25).';
      }
      return 'Formato inválido.';
    }

    return '';
  }

  /** Valida si hay más de un módulo */
  evaluarCantidadModulos(): boolean {
    return this.modulos.length > 1;
  }

  /** Valida si hay más de un objetivo */
  evaluarCantidadObjetivos(): boolean {
    return this.objetivos.length > 1;
  }

  /** Carga los centros educativos desde el backend */
  private loadCentros(): void {
    this.loadingCentros = true;
    this.centrosService.getCentros().subscribe({
      next: (centros) => {
        this.centros = centros.data;
        this.loadingCentros = false;
      },
      error: () => (this.loadingCentros = false)
    });
  }

  /** Carga los datos de la formación a editar desde el servicio */
  private loadFormacionAEditar(): void {
    this.loadingFormacionAEditar = true;
    this.formacionService.getFormacionAEditar().subscribe({
      next: (formacion) => {
        if (!formacion) {
          this.loadingFormacionAEditar = false;
          return;
        }

        this.formacionData = formacion;
        this.form.patchValue(this.formacionData);
        this.form.patchValue({
          curso_inicio: this.formacionData.cursos[0],
          curso_fin: this.formacionData.cursos[1] || null,
          centro_id: this.formacionData.centro?.id || null
        });

        this.loadingFormacionAEditar = false;
      },
      error: () => {
        this.loadingFormacionAEditar = false;
      }
    });
  }

  /** Limpia el formulario manualmente */
  public clearForm(): void {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  /**
   * Valida que el curso final sea posterior al inicial en formato AAAA/AA.
   * @returns `true` si es válido, `false` si no lo es.
   */
  public isCursoFinalValido(): boolean {
    const inicio = this.form.get('curso_inicio')?.value;
    const fin = this.form.get('curso_fin')?.value;
    if (!inicio || !fin) return true;

    const [inicioAnioCompleto, inicioAnioCorto] = inicio.split('/');
    const [finAnioCompleto, finAnioCorto] = fin.split('/');

    const inicioAnioCompNum = parseInt(inicioAnioCompleto);
    const finAnioCompNum = parseInt(finAnioCompleto);
    const inicioAnioCortoNum = parseInt(inicioAnioCorto);
    const finAnioCortoNum = parseInt(finAnioCorto);

    if (
        isNaN(inicioAnioCompNum) || isNaN(finAnioCompNum) ||
        isNaN(inicioAnioCortoNum) || isNaN(finAnioCortoNum)
    ) return true;

    if (finAnioCompNum <= inicioAnioCompNum) return false;
    if ((finAnioCortoNum - inicioAnioCortoNum) !== (finAnioCompNum - inicioAnioCompNum)) return false;

    return true;
  }

  private generateCursos() {
    const anioInicio = 2024;
    const anios = 10; // Cambia si quieres más
    this.cursosDisponibles = Array.from({ length: anios }, (_, i) => {
      const inicio = anioInicio + i;
      const final = inicio + 1;
      return `${inicio}/${String(final).slice(-2)}`;
    });
  }

  protected cursosFiltradosFin(): string[] {
    const inicio = this.form.get('curso_inicio')?.value;
    if (!inicio) return this.cursosDisponibles;

    const indexInicio = this.cursosDisponibles.indexOf(inicio);
    return this.cursosDisponibles.slice(indexInicio + 1);
  }

}
