CREATE TABLE IF NOT EXISTS roles(
  id TINYINT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(25) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT 1,
  CONSTRAINT pk_roles PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS provincia (
  id CHAR(2) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  CONSTRAINT pk_provincia PRIMARY KEY (id),
  CONSTRAINT cck_provincia CHECK (id REGEXP '^[0-9]{2}$')
);

CREATE TABLE IF NOT EXISTS localidad (
  id TINYINT NOT NULL AUTO_INCREMENT,
  nombre_localidad VARCHAR(50) NOT NULL,
  provincia_id CHAR(2) NOT NULL,
  CONSTRAINT pk_localidad PRIMARY KEY (id),
  CONSTRAINT fk_localidad_provincia FOREIGN KEY (provincia_id) REFERENCES provincia(id)
);

CREATE TABLE IF NOT EXISTS curso_academico (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  nombre_curso VARCHAR(30) NOT NULL,
  fecha_inicio DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_fin DATETIME NULL,
  CONSTRAINT pk_curso_academico PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS usuario (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  nombre_user VARCHAR(40) NOT NULL,
  apellido_user VARCHAR(50) NOT NULL,
  correo_user VARCHAR(70) NOT NULL,
  telefono_user VARCHAR(9) NOT NULL,
  nuevo_educador BOOLEAN NOT NULL DEFAULT 1,
  id_rol TINYINT NOT NULL,
  CONSTRAINT pk_usuario PRIMARY KEY (id),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id),
  CONSTRAINT cck_telefono_user CHECK (telefono_user REGEXP '^[0-9]{9}$'),
  CONSTRAINT cck_correo_user CHECK (correo_user REGEXP '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@fundacionloyola\\.net$')
);

CREATE TABLE IF NOT EXISTS formacion (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  lugar_imparticion VARCHAR(60) NOT NULL,
  duracion VARCHAR(255) NOT NULL,
  modalidad VARCHAR(20) NOT NULL,
  justificacion VARCHAR(255) NOT NULL,
  metodologia VARCHAR(255) NOT NULL,
  docentes VARCHAR(255) NOT NULL,
  dirigido_a VARCHAR(255) NOT NULL,
  activo BOOLEAN NOT NULL,
  CONSTRAINT pk_formacion PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS inscripciones(
  id_formacion SMALLINT NOT NULL,
  id_usu SMALLINT NOT NULL,
  fecha_inscripcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_inscripiones PRIMARY KEY (id_formacion, id_usu),
  CONSTRAINT fk_inscripcion_formacion FOREIGN KEY (id_formacion) REFERENCES formacion(id),
  CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (id_usu) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS centro_fundacion (
  id TINYINT NOT NULL AUTO_INCREMENT,
  nombre_centro VARCHAR(50) NOT NULL,
  direccion_centro VARCHAR(50) NOT NULL,
  cp CHAR(5) NOT NULL,
  correo_centro VARCHAR(255) NOT NULL,
  telefono_centro CHAR(9) NOT NULL,
  id_local TINYINT NOT NULL,
  CONSTRAINT pk_centro PRIMARY KEY (id),
  CONSTRAINT cck_cp CHECK (cp REGEXP '^[0-9]{5}$'),
  CONSTRAINT cck_correo_centro CHECK (correo_centro LIKE '%@fundacionloyola.net'),
  CONSTRAINT cck_telefono_centro CHECK (telefono_centro REGEXP '^[0-9]{9}$'),
  CONSTRAINT fk_centro_local FOREIGN KEY (id_local) REFERENCES localidad(id)
);

CREATE TABLE IF NOT EXISTS centro_formacion (
  id_centro TINYINT NOT NULL,
  id_formacion SMALLINT NOT NULL,
  CONSTRAINT pk_centro_formacion PRIMARY KEY (id_centro, id_formacion),
  CONSTRAINT fk_centro_formacion_centro FOREIGN KEY (id_centro) REFERENCES centro_fundacion(id),
  CONSTRAINT fk_centro_formacion_formacion FOREIGN KEY (id_formacion) REFERENCES formacion(id)
);

CREATE TABLE IF NOT EXISTS modulo (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  nombre_modulo VARCHAR(50) NOT NULL,
  id_formacion SMALLINT NOT NULL,
  CONSTRAINT pk_modulo PRIMARY KEY (id),
  CONSTRAINT fk_modulo_formacion FOREIGN KEY (id_formacion) REFERENCES formacion(id)
);

CREATE TABLE IF NOT EXISTS objetivo (
  id SMALLINT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(150) NOT NULL,
  CONSTRAINT pk_objetivo PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS objetivo_formacion (
  id_formacion SMALLINT NOT NULL,
  id_objetivo SMALLINT NOT NULL,
  CONSTRAINT pk_objetivo_formacion PRIMARY KEY (id_formacion, id_objetivo),
  CONSTRAINT fk_objetivo_formacion_formacion FOREIGN KEY (id_formacion) REFERENCES formacion(id),
  CONSTRAINT fk_objetivo_formacion_objetivo FOREIGN KEY (id_objetivo) REFERENCES objetivo(id)
);

CREATE TABLE IF NOT EXISTS formacion_curso (
  id_curso SMALLINT NOT NULL,
  id_formacion SMALLINT NOT NULL,
  CONSTRAINT pk_formacion_curso PRIMARY KEY (id_curso, id_formacion),
  CONSTRAINT fk_formacion_curso_curso_academico FOREIGN KEY (id_curso) REFERENCES curso_academico(id),
  CONSTRAINT fk_formacion_curso_formacion FOREIGN KEY (id_formacion) REFERENCES formacion(id)
);
