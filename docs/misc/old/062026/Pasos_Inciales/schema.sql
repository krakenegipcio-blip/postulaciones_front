/*
  Schema para PostgreSQL Local - Gestor de Postulaciones Laborales
  Ejecutar este script en DBeaver conectado a la base de datos "postulaciones_analisis"
*/

-- EMPRESA
CREATE TABLE IF NOT EXISTS empresa (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- CARGO
CREATE TABLE IF NOT EXISTS cargo (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ESTADO
CREATE TABLE IF NOT EXISTS estado (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  color_hex text NOT NULL DEFAULT '#6b7280',
  created_at timestamptz DEFAULT now()
);

-- PLATAFORMA
CREATE TABLE IF NOT EXISTS plataforma (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- MODALIDAD
CREATE TABLE IF NOT EXISTS modalidad (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  color_hex text NOT NULL DEFAULT '#6b7280',
  created_at timestamptz DEFAULT now()
);

-- UBICACION
CREATE TABLE IF NOT EXISTS ubicacion (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- TECNOLOGIA
CREATE TABLE IF NOT EXISTS tecnologia (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  id_padre integer REFERENCES tecnologia(id) ON DELETE SET NULL,
  color_hex text NOT NULL DEFAULT '#61dafb',
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- NIVEL_EXPERIENCIA
CREATE TABLE IF NOT EXISTS nivel_experiencia (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- METODO_EVALUACION
CREATE TABLE IF NOT EXISTS metodo_evaluacion (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  color_hex text NOT NULL DEFAULT '#6b7280',
  created_at timestamptz DEFAULT now()
);

-- POSTULACION
CREATE TABLE IF NOT EXISTS postulacion (
  id serial PRIMARY KEY,
  descripcion text DEFAULT '',
  id_empresa integer REFERENCES empresa(id) ON DELETE SET NULL,
  id_cargo integer REFERENCES cargo(id) ON DELETE SET NULL,
  id_estado integer NOT NULL REFERENCES estado(id),
  url text,
  id_plataforma integer REFERENCES plataforma(id) ON DELETE SET NULL,
  id_modalidad integer REFERENCES modalidad(id) ON DELETE SET NULL,
  id_ubicacion integer REFERENCES ubicacion(id) ON DELETE SET NULL,
  dias_presenciales integer,
  sueldo_ofrecido numeric(12,2),
  cantidad_solicitudes integer,
  id_nivel integer REFERENCES nivel_experiencia(id) ON DELETE SET NULL,
  sueldo_pedido numeric(12,2),
  fecha_postulacion date NOT NULL DEFAULT CURRENT_DATE,
  fecha_actualizacion timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Trigger auto-update fecha_actualizacion
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_postulacion_updated ON postulacion;
CREATE TRIGGER trg_postulacion_updated
  BEFORE UPDATE ON postulacion
  FOR EACH ROW EXECUTE FUNCTION update_fecha_actualizacion();

-- POSTULACION_TECNOLOGIA (muchos a muchos)
CREATE TABLE IF NOT EXISTS postulacion_tecnologia (
  id_postulacion integer NOT NULL REFERENCES postulacion(id) ON DELETE CASCADE,
  id_tecnologia integer NOT NULL REFERENCES tecnologia(id) ON DELETE CASCADE,
  PRIMARY KEY (id_postulacion, id_tecnologia)
);

-- POSTULACION_METODO (muchos a muchos)
CREATE TABLE IF NOT EXISTS postulacion_metodo (
  id_postulacion integer NOT NULL REFERENCES postulacion(id) ON DELETE CASCADE,
  id_metodo_evaluacion integer NOT NULL REFERENCES metodo_evaluacion(id) ON DELETE CASCADE,
  PRIMARY KEY (id_postulacion, id_metodo_evaluacion)
);

-- =============================================
-- DATOS SEMILLA
-- =============================================

INSERT INTO empresa (nombre) VALUES
  ('Sin especificar'),('Agilistik'),('Falabella'),('Mercado Libre'),('Bci'),('Banco Estado')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cargo (nombre) VALUES
  ('Sin especificar'),('Full Stack Developer'),('Frontend Developer'),('Backend Developer'),
  ('DevOps Engineer'),('Data Engineer'),('Mobile Developer'),('QA Engineer')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO estado (nombre, color_hex) VALUES
  ('En Espera', '#f59e0b'),('Entrevista', '#3b82f6'),('Rechazado', '#ef4444'),
  ('Finalizado', '#22c55e'),('Entrazado', '#8b5cf6'),('Pausa', '#6b7280')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO plataforma (nombre) VALUES
  ('Sin especificar'),('LinkedIn'),('GetOnBoard'),('InfoJobs'),
  ('Indeed'),('Computrabajo'),('Laborum'),('Trabajando.com')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO modalidad (nombre, color_hex) VALUES
  ('Presencial', '#10b981'),('Remoto', '#3b82f6'),('Híbrido', '#f59e0b')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO ubicacion (nombre) VALUES
  ('Sin especificar'),('Santiago'),('Valparaíso'),('Concepción'),
  ('Viña del Mar'),('Antofagasta'),('Temuco'),('Remoto Internacional')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO nivel_experiencia (nombre, orden) VALUES
  ('Trainee', 1),('Junior', 2),('Semi Senior', 3),('Senior', 4)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO tecnologia (nombre, id_padre, color_hex) VALUES
  ('React', NULL, '#61dafb'),('Angular', NULL, '#dd0031'),('Vue', NULL, '#42b883'),
  ('Node.js', NULL, '#68a063'),('Java', NULL, '#f89820'),('Python', NULL, '#3776ab'),
  ('.NET', NULL, '#512bd4'),('PostgreSQL', NULL, '#336791'),('MySQL', NULL, '#4479a1'),
  ('MongoDB', NULL, '#47a248'),('Docker', NULL, '#2496ed'),('Kubernetes', NULL, '#326ce5'),
  ('AWS', NULL, '#ff9900'),('Azure', NULL, '#0078d4'),('TypeScript', NULL, '#3178c6'),
  ('JavaScript', NULL, '#f7df1e'),('Inglés', NULL, '#6b7280'),('Golang', NULL, '#00add8'),
  ('Kotlin', NULL, '#7f52ff'),('Swift', NULL, '#fa7343')
ON CONFLICT (nombre) DO NOTHING;

DO $$
DECLARE
  v_react_id int; v_java_id int; v_python_id int;
  v_aws_id int; v_dotnet_id int; v_node_id int;
BEGIN
  SELECT id INTO v_react_id FROM tecnologia WHERE nombre = 'React';
  SELECT id INTO v_java_id FROM tecnologia WHERE nombre = 'Java';
  SELECT id INTO v_python_id FROM tecnologia WHERE nombre = 'Python';
  SELECT id INTO v_aws_id FROM tecnologia WHERE nombre = 'AWS';
  SELECT id INTO v_dotnet_id FROM tecnologia WHERE nombre = '.NET';
  SELECT id INTO v_node_id FROM tecnologia WHERE nombre = 'Node.js';

  INSERT INTO tecnologia (nombre, id_padre, color_hex) VALUES
    ('React Native', v_react_id, '#61dafb'),('Next.js', v_react_id, '#000000'),
    ('Spring Boot', v_java_id, '#6db33f'),('Hibernate', v_java_id, '#59666c'),
    ('Django', v_python_id, '#092e20'),('FastAPI', v_python_id, '#009688'),
    ('AWS Lambda', v_aws_id, '#f59e0b'),('AWS S3', v_aws_id, '#f59e0b'),
    ('Express.js', v_node_id, '#68a063'),('NestJS', v_node_id, '#e0234e'),
    ('ASP.NET Core', v_dotnet_id, '#512bd4'),('Blazor', v_dotnet_id, '#512bd4')
  ON CONFLICT (nombre) DO NOTHING;
END $$;

INSERT INTO metodo_evaluacion (nombre, color_hex) VALUES
  ('Test Gorila', '#ef4444'),('Prueba Online', '#3b82f6'),('Prueba por Correo', '#f59e0b'),
  ('Evalart', '#22c55e'),('Entrevista Técnica', '#8b5cf6'),('Coding Challenge', '#06b6d4'),
  ('Pair Programming', '#ec4899')
ON CONFLICT (nombre) DO NOTHING;
