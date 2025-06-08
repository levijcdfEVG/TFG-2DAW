-- Tabla: provincia
CREATE TABLE `provincia` (
  `id` char(2) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cck_provincia` CHECK (regexp_like(`id`,_utf8mb4'^[0-9]{2}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: localidad
CREATE TABLE `localidad` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `nombre_localidad` varchar(50) NOT NULL,
  `provincia_id` char(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_localidad_provincia` (`provincia_id`),
  CONSTRAINT `fk_localidad_provincia` FOREIGN KEY (`provincia_id`) REFERENCES `provincia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: curso_academico
CREATE TABLE `curso_academico` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nombre_curso` varchar(30) NOT NULL,
  `fecha_inicio` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cck_nombre_curso` CHECK (regexp_like(`nombre_curso`,_utf8mb4'^[0-9]{4}/[0-9]{2}$'))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: roles
CREATE TABLE `roles` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(25) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: centro_fundacion
CREATE TABLE `centro_fundacion` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `nombre_centro` varchar(50) NOT NULL,
  `direccion_centro` varchar(50) NOT NULL,
  `cp` char(5) NOT NULL,
  `correo_centro` varchar(255) NOT NULL,
  `telefono_centro` char(9) NOT NULL,
  `id_local` tinyint NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unk_correo_centro` (`correo_centro`),
  KEY `fk_centro_local` (`id_local`),
  CONSTRAINT `fk_centro_local` FOREIGN KEY (`id_local`) REFERENCES `localidad` (`id`),
  CONSTRAINT `cck_correo_centro` CHECK (regexp_like(`correo_centro`,_utf8mb4'^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.)?fundacionloyola\\.(net|es)$')),
  CONSTRAINT `cck_cp` CHECK (regexp_like(`cp`,_utf8mb4'^[0-9]{5}$')),
  CONSTRAINT `cck_telefono_centro` CHECK (regexp_like(`telefono_centro`,_utf8mb4'^[0-9]{9}$'))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: usuario
CREATE TABLE `usuario` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nombre_user` varchar(40) NOT NULL,
  `apellido_user` varchar(50) NOT NULL,
  `correo_user` varchar(70) NOT NULL,
  `telefono_user` varchar(9) NOT NULL,
  `nuevo_educador` tinyint(1) NOT NULL DEFAULT '1',
  `id_rol` tinyint NOT NULL,
  `id_centro` tinyint NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fch_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unk_correo_user` (`correo_user`),
  KEY `fk_usuario_rol` (`id_rol`),
  KEY `fk_usuario_centro` (`id_centro`),
  CONSTRAINT `fk_usuario_centro` FOREIGN KEY (`id_centro`) REFERENCES `centro_fundacion` (`id`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`),
  CONSTRAINT `cck_correo_user` CHECK (regexp_like(`correo_user`,_utf8mb4'^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.)?fundacionloyola\\.(net|es)$')),
  CONSTRAINT `cck_telefono_user` CHECK (regexp_like(`telefono_user`,_utf8mb4'^[0-9]{9}$'))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: formacion
CREATE TABLE `formacion` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `lugar_imparticion` varchar(60) NOT NULL,
  `duracion` varchar(255) NOT NULL,
  `modalidad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `justificacion` varchar(255) NOT NULL,
  `metodologia` varchar(255) NOT NULL,
  `docentes` varchar(255) NOT NULL,
  `dirigido_a` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: objetivo
CREATE TABLE `objetivo` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: modulo
CREATE TABLE `modulo` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(50) NOT NULL,
  `id_formacion` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_modulo_formacion` (`id_formacion`),
  CONSTRAINT `fk_modulo_formacion` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: formacion_curso
CREATE TABLE `formacion_curso` (
  `id_curso` smallint NOT NULL,
  `id_formacion` smallint NOT NULL,
  PRIMARY KEY (`id_curso`,`id_formacion`),
  KEY `fk_formacion_curso_formacion` (`id_formacion`),
  CONSTRAINT `fk_formacion_curso_curso_academico` FOREIGN KEY (`id_curso`) REFERENCES `curso_academico` (`id`),
  CONSTRAINT `fk_formacion_curso_formacion` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: objetivo_formacion
CREATE TABLE `objetivo_formacion` (
  `id_formacion` smallint NOT NULL,
  `id_objetivo` smallint NOT NULL,
  PRIMARY KEY (`id_formacion`,`id_objetivo`),
  KEY `fk_objetivo_formacion_objetivo` (`id_objetivo`),
  CONSTRAINT `fk_objetivo_formacion_formacion` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id`),
  CONSTRAINT `fk_objetivo_formacion_objetivo` FOREIGN KEY (`id_objetivo`) REFERENCES `objetivo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: centro_formacion
CREATE TABLE `centro_formacion` (
  `id_centro` tinyint NOT NULL,
  `id_formacion` smallint NOT NULL,
  PRIMARY KEY (`id_centro`,`id_formacion`),
  KEY `fk_centro_formacion_formacion` (`id_formacion`),
  CONSTRAINT `fk_centro_formacion_centro` FOREIGN KEY (`id_centro`) REFERENCES `centro_fundacion` (`id`),
  CONSTRAINT `fk_centro_formacion_formacion` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: inscripciones
CREATE TABLE `inscripciones` (
  `id_formacion` smallint NOT NULL,
  `id_usu` smallint NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id_formacion`,`id_usu`),
  KEY `fk_inscripcion_usuario` (`id_usu`),
  CONSTRAINT `fk_inscripcion_formacion` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id`),
  CONSTRAINT `fk_inscripcion_usuario` FOREIGN KEY (`id_usu`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
