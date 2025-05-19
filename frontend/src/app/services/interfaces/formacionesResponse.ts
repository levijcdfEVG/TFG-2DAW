export interface Formacion {
    id: number;
    lugar_imparticion: string;
    duracion: string;
    modalidad: string;
    justificacion: string;
    metodologia: string;
    docentes: string;
    dirigido_a: string;
}

export interface FormacionResponse {
    success: boolean;
    data: Formacion[];
}

export interface AddCentroPayload {
    formacion: Formacion;
    modulos: { nombre_modulo: string }[];
    objetivos: { descripcion: string }[];
    centros: number[];
    cursos: string[];
}

export interface ModificarCentroPayload {
    id: number;
    formacion: Formacion;
    modulos: { nombre_modulo: string }[];
    objetivos: { descripcion: string }[];
    centros: number[];
    cursos: string[];
}
