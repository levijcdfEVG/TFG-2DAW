interface Formacion {
    id: number;
    lugar_imparticion: string;
    duracion: string;
    modalidad: string;
    justificacion: string;
    metodologia: string;
    docentes: string;
    dirigido_a: string;
}

interface FormacionResponse {
    success: boolean;
    data: Formacion[];
}
