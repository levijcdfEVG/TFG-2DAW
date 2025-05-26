-- Roles
INSERT INTO roles (nombre_rol) VALUES
    ('Educador'),
    ('Administrador'),
    ('Responsable de Centro');

-- Provincias
INSERT INTO provincia (id, nombre) VALUES
    ('06', 'Badajoz'),
    ('37', 'Salamanca'),
    ('04', 'Almería'),
    ('41', 'Sevilla'),
    ('46', 'Valencia');

-- Localidades
INSERT INTO localidad (nombre_localidad, provincia_id) VALUES
    ('Badajoz', '06'),
    ('Don Benito', '06'),
    ('Salamanca', '37'),
    ('Ciudad Rodrigo', '37'),
    ('Almería', '04'),
    ('Roquetas de Mar', '04'),
    ('Sevilla', '41'),
    ('Tomares', '41'),
    ('Valencia', '46'),
    ('Alicante', '46');

-- Centros Fundacion
INSERT INTO centro_fundacion (nombre_centro, direccion_centro, cp, correo_centro, telefono_centro, id_local) VALUES
    ('Badajoz Centro', 'Calle de la Fundación, Badajoz', '06001', 'badajoz.centro@fundacionloyola.net', '924232323', 1),
    ('Don Benito Centro', 'Avenida de la Educación, Don Benito', '06400', 'donbenito.centro@fundacionloyola.net', '924321456', 2),
    ('Salamanca Centro', 'Calle de la Investigación, Salamanca', '37007', 'salamanca.centro@fundacionloyola.net', '923456789', 3),
    ('Ciudad Rodrigo Centro', 'Avenida de la Fundación, Ciudad Rodrigo', '07400', 'ciudaddrigocentro@fundacionloyola.net', '924112233', 4),
    ('Almería Centro', 'Paseo Marítimo, Almería', '04001', 'almeriacentro@fundacionloyola.net', '950111222', 5);

-- Usuarios (corrigiendo: se añade id_centro)
INSERT INTO usuario (nombre_user, apellido_user, correo_user, telefono_user, nuevo_educador, id_rol, id_centro) VALUES
  ('Alvaro', 'Gomez Delgado', 'agomezdelgado.guadalupe@alumnado.fundacionloyola.net', '672775698', 0, 2, 1),
  ('David', 'Silva Vega', 'dsilvavega.guadalupe@alumnado.fundacionloyola.net', '644266926', 0, 2, 1),
  ('Juan Carlos', 'García Fernández', 'juan.garcia@fundacionloyola.net', '615123456', 0, 2, 1),
  ('Ana Isabel', 'Martínez López', 'ana.martinez.centro1@fundacionloyola.net', '666789012', 0, 3, 2),
  ('Pedro Alberto', 'Sánchez González', 'pedro.sanchez.centro2@fundacionloyola.net', '777901234', 0, 3, 3),
  ('Miguel Ángel', 'Ruiz Hernández', 'miguel.ruiz.centro3@fundacionloyola.net', '888111222', 0, 3, 4),
  ('Laura Elena', 'Gómez Moreno', 'laura.gomez.especialidad1@fundacionloyola.net', '999222333', 0, 1, 2),
  ('Carlos Manuel', 'Martín Fernández', 'carlos.martin.especialidad2@fundacionloyola.net', '101234567', 0, 1, 3),
  ('María del Carmen', 'García Sánchez', 'maria.garcia.especialidad3@fundacionloyola.net', '112345678', 0, 1, 4),
  ('Raquel Sofía', 'Serrano Pérez', 'raquel.serrano.especialidad4@fundacionloyola.net', '121234567', 1, 1, 5);

-- Cursos académicos
INSERT INTO curso_academico (nombre_curso, fecha_inicio, fecha_fin) VALUES
    ('2020/21', '2020-09-01 00:00:00', '2021-06-30 23:59:59'),
    ('2019/20', '2019-09-01 00:00:00', '2020-06-30 23:59:59'),
    ('2018/19', '2018-09-01 00:00:00', '2019-06-30 23:59:59'),
    ('2017/18', '2017-09-01 00:00:00', '2018-06-30 23:59:59'),
    ('2021/22', '2021-09-01 00:00:00', '2022-06-30 23:59:59');

-- Formaciones
INSERT INTO formacion (lugar_imparticion, duracion, modalidad, justificacion, metodologia, docentes, dirigido_a, activo) VALUES
    ('Centro de Formación', '3 horas', 'Presencial', 'Justificar la necesidad de una formación en un tema específico', 'Método de aprendizaje activo y participativo', 'Docente 1, Docente 2, Docente 3', 'Personal del Centro de Formación', TRUE),
    ('Centro de Investigación', '5 días', 'Semipresencial', 'Justificar la necesidad de una formación en un tema específico', 'Método de aprendizaje flexible y adaptable', 'Investigador 1, Investigador 2, Investigador 3', 'Personal del Centro de Investigación', TRUE),
    ('Centro de Capacitación', '4 horas', 'E-learning', 'Justificar la necesidad de una formación en un tema específico', 'Método de aprendizaje en línea y virtual', 'Capacitador 1, Capacitador 2, Capacitador 3', 'Personal del Centro de Capacitación', TRUE),
    ('Centro de Desarrollo', '6 semanas', 'A distancia', 'Justificar la necesidad de una formación en un tema específico', 'Método de aprendizaje autónomo y flexible', 'Desarrollador 1, Desarrollador 2, Desarrollador 3', 'Personal del Centro de Desarrollo', TRUE);

INSERT INTO inscripciones (id_formacion, id_usu) VALUES
  (1, 1), (1, 2), (1, 3),
  (2, 4), (2, 3), (2, 1),
  (3, 1), (4, 4);

  INSERT INTO centro_formacion (id_centro, id_formacion) VALUES
  (1, 1), (2, 3), (3, 2), (4, 4), (5, 1),
  (1, 2), (3, 4), (5, 3);

-- Modulos
INSERT INTO modulo (nombre_modulo, id_formacion) VALUES
    ('Modulo 1: Introducción', 1),
    ('Modulo 2: Fundamentos', 1),
    ('Modulo 3: Aplicación', 1),

    ('Modulo 4: Investigación Básica', 2),
    ('Modulo 5: Análisis de Datos', 2),
    ('Modulo 6: Presentación de Resultados', 2),

    ('Modulo 7: Planificación y Gestión', 3),
    ('Modulo 8: Recursos Humanos', 3),
    ('Modulo 9: Finanzas y Contabilidad', 3),

    ('Modulo 10: Desarrollo Personal', 4),
    ('Modulo 11: Liderazgo y Comunicación', 4),
    ('Modulo 12: Innovación y Creatividad', 4);

-- Objetivos
INSERT INTO objetivo (descripcion) VALUES
    ('Desarrollar habilidades básicas en el Centro de Formación'),
    ('Aplicar conocimientos teóricos y prácticos en el Centro de Investigación'),
    ('Mejorar las competencias laborales en el Centro de Capacitación'),
    ('Fomentar el crecimiento personal y profesional en el Centro de Desarrollo');

-- Objetivos Formaciones
INSERT INTO objetivo_formacion (id_formacion, id_objetivo) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);
-- Formaciones Curso
INSERT INTO formacion_curso (id_curso, id_formacion) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 4), (2, 1), (2, 2),
    (3, 3), (3, 4),
    (4, 1), (4, 2), (4, 3),
    (5, 4), (5, 1), (5, 2);