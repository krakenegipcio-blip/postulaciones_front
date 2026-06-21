--
-- PostgreSQL database dump
--

\restrict 1niiG0CqU38ItlTEuHMlIRCx0XelsIkiuIXcrxWNtgGAAIfvwAeyGKyXJRrKRsI

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-18 18:23:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 247 (class 1255 OID 16555)
-- Name: update_fecha_actualizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_fecha_actualizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_fecha_actualizacion() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16399)
-- Name: cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargo (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    orden integer DEFAULT 0,
    usuario_id integer
);


ALTER TABLE public.cargo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16398)
-- Name: cargo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cargo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cargo_id_seq OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 221
-- Name: cargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargo_id_seq OWNED BY public.cargo.id;


--
-- TOC entry 220 (class 1259 OID 16385)
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16384)
-- Name: empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresa_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 219
-- Name: empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresa_id_seq OWNED BY public.empresa.id;


--
-- TOC entry 224 (class 1259 OID 16413)
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16412)
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_id_seq OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 223
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- TOC entry 242 (class 1259 OID 16616)
-- Name: fase_seguimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fase_seguimiento (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    color_hex character varying(7) DEFAULT '#38bdf8'::character varying NOT NULL,
    icono character varying(50),
    orden_default integer DEFAULT 0 NOT NULL,
    es_final boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fase_seguimiento OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16615)
-- Name: fase_seguimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fase_seguimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fase_seguimiento_id_seq OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 241
-- Name: fase_seguimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fase_seguimiento_id_seq OWNED BY public.fase_seguimiento.id;


--
-- TOC entry 234 (class 1259 OID 16494)
-- Name: metodo_evaluacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodo_evaluacion (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.metodo_evaluacion OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16493)
-- Name: metodo_evaluacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metodo_evaluacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metodo_evaluacion_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 233
-- Name: metodo_evaluacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodo_evaluacion_id_seq OWNED BY public.metodo_evaluacion.id;


--
-- TOC entry 228 (class 1259 OID 16443)
-- Name: modalidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modalidad (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.modalidad OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16442)
-- Name: modalidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modalidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modalidad_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 227
-- Name: modalidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modalidad_id_seq OWNED BY public.modalidad.id;


--
-- TOC entry 240 (class 1259 OID 16594)
-- Name: nivel_experiencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nivel_experiencia (
    id integer NOT NULL,
    nombre text NOT NULL,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.nivel_experiencia OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16593)
-- Name: nivel_experiencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nivel_experiencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nivel_experiencia_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 239
-- Name: nivel_experiencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nivel_experiencia_id_seq OWNED BY public.nivel_experiencia.id;


--
-- TOC entry 226 (class 1259 OID 16429)
-- Name: plataforma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plataforma (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.plataforma OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16428)
-- Name: plataforma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plataforma_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plataforma_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 225
-- Name: plataforma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plataforma_id_seq OWNED BY public.plataforma.id;


--
-- TOC entry 236 (class 1259 OID 16510)
-- Name: postulacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion (
    id integer NOT NULL,
    descripcion text DEFAULT ''::text,
    id_empresa integer,
    id_cargo integer,
    id_estado integer NOT NULL,
    url text,
    id_plataforma integer,
    id_modalidad integer,
    id_ubicacion integer,
    dias_presenciales integer,
    sueldo_ofrecido numeric(12,2),
    fecha_postulacion date DEFAULT CURRENT_DATE NOT NULL,
    fecha_actualizacion timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    cantidad_solicitudes integer,
    id_nivel integer,
    sueldo_pedido numeric(12,2),
    usuario_id integer
);


ALTER TABLE public.postulacion OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16509)
-- Name: postulacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postulacion_id_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 235
-- Name: postulacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulacion_id_seq OWNED BY public.postulacion.id;


--
-- TOC entry 238 (class 1259 OID 16574)
-- Name: postulacion_metodo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion_metodo (
    id_postulacion integer NOT NULL,
    id_metodo_evaluacion integer NOT NULL
);


ALTER TABLE public.postulacion_metodo OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16635)
-- Name: postulacion_seguimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion_seguimiento (
    id integer NOT NULL,
    id_postulacion integer NOT NULL,
    id_fase_seguimiento integer NOT NULL,
    id_metodo_evaluacion integer,
    titulo character varying(150),
    nota text,
    fecha_evento date NOT NULL,
    fecha_limite date,
    resultado character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_postulacion_seguimiento_resultado CHECK (((resultado)::text = ANY ((ARRAY['pendiente'::character varying, 'completado'::character varying, 'aprobado'::character varying, 'rechazado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.postulacion_seguimiento OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16634)
-- Name: postulacion_seguimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulacion_seguimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postulacion_seguimiento_id_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 243
-- Name: postulacion_seguimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulacion_seguimiento_id_seq OWNED BY public.postulacion_seguimiento.id;


--
-- TOC entry 237 (class 1259 OID 16557)
-- Name: postulacion_tecnologia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion_tecnologia (
    id_postulacion integer NOT NULL,
    id_tecnologia integer NOT NULL
);


ALTER TABLE public.postulacion_tecnologia OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16473)
-- Name: tecnologia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tecnologia (
    id integer NOT NULL,
    nombre text NOT NULL,
    id_padre integer,
    color_hex text DEFAULT '#61dafb'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    orden integer DEFAULT 0,
    usuario_id integer
);


ALTER TABLE public.tecnologia OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16472)
-- Name: tecnologia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tecnologia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tecnologia_id_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 231
-- Name: tecnologia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tecnologia_id_seq OWNED BY public.tecnologia.id;


--
-- TOC entry 230 (class 1259 OID 16459)
-- Name: ubicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ubicacion (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    usuario_id integer
);


ALTER TABLE public.ubicacion OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16458)
-- Name: ubicacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ubicacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ubicacion_id_seq OWNER TO postgres;

--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 229
-- Name: ubicacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ubicacion_id_seq OWNED BY public.ubicacion.id;


--
-- TOC entry 246 (class 1259 OID 16675)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16674)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 245
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4927 (class 2604 OID 16402)
-- Name: cargo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo ALTER COLUMN id SET DEFAULT nextval('public.cargo_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 16388)
-- Name: empresa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa ALTER COLUMN id SET DEFAULT nextval('public.empresa_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 16416)
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 16619)
-- Name: fase_seguimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fase_seguimiento ALTER COLUMN id SET DEFAULT nextval('public.fase_seguimiento_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 16497)
-- Name: metodo_evaluacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion ALTER COLUMN id SET DEFAULT nextval('public.metodo_evaluacion_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 16446)
-- Name: modalidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad ALTER COLUMN id SET DEFAULT nextval('public.modalidad_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 16597)
-- Name: nivel_experiencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nivel_experiencia ALTER COLUMN id SET DEFAULT nextval('public.nivel_experiencia_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 16432)
-- Name: plataforma id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma ALTER COLUMN id SET DEFAULT nextval('public.plataforma_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16513)
-- Name: postulacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion ALTER COLUMN id SET DEFAULT nextval('public.postulacion_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16638)
-- Name: postulacion_seguimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_seguimiento ALTER COLUMN id SET DEFAULT nextval('public.postulacion_seguimiento_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 16476)
-- Name: tecnologia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia ALTER COLUMN id SET DEFAULT nextval('public.tecnologia_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16462)
-- Name: ubicacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion ALTER COLUMN id SET DEFAULT nextval('public.ubicacion_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16678)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5199 (class 0 OID 16399)
-- Dependencies: 222
-- Data for Name: cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cargo VALUES (1, 'Sin especificar', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (2, 'Full Stack Developer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (3, 'Frontend Developer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (4, 'Backend Developer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (5, 'DevOps Engineer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (6, 'Data Engineer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (7, 'Mobile Developer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (8, 'QA Engineer', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.cargo VALUES (9, 'Analista de Automatización y Datos', '2026-05-07 06:23:54.047133-04', 0, 1);
INSERT INTO public.cargo VALUES (10, 'Soporte Informático', '2026-05-13 05:30:59.496643-04', 0, 1);
INSERT INTO public.cargo VALUES (11, 'Ciberseguridad', '2026-05-19 17:45:10.009778-04', 0, 1);


--
-- TOC entry 5197 (class 0 OID 16385)
-- Dependencies: 220
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresa VALUES (1, 'Sin especificar', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.empresa VALUES (8, 'Confidencial', '2026-05-05 05:31:13.349258-04', 1);
INSERT INTO public.empresa VALUES (9, 'WITI', '2026-05-05 05:31:16.021382-04', 1);
INSERT INTO public.empresa VALUES (10, 'BC Tecnlogía', '2026-05-07 06:23:27.769747-04', 1);
INSERT INTO public.empresa VALUES (11, 'Perficient', '2026-05-13 07:02:26.808991-04', 1);
INSERT INTO public.empresa VALUES (12, 'Kibernum', '2026-05-13 07:04:26.976361-04', 1);
INSERT INTO public.empresa VALUES (13, '23People', '2026-05-19 18:14:40.469552-04', 1);
INSERT INTO public.empresa VALUES (14, 'Geolize', '2026-05-19 18:19:31.267307-04', 1);
INSERT INTO public.empresa VALUES (15, 'Sermaluc', '2026-05-19 18:31:56.005773-04', 1);
INSERT INTO public.empresa VALUES (16, 'Houm', '2026-05-19 18:40:15.418062-04', 1);
INSERT INTO public.empresa VALUES (17, 'R y C Consultores Asociados', '2026-05-19 18:43:12.756979-04', 1);
INSERT INTO public.empresa VALUES (18, 'Seek', '2026-05-19 18:48:56.158574-04', 1);
INSERT INTO public.empresa VALUES (19, 'Lisit', '2026-05-19 18:52:57.735971-04', 1);
INSERT INTO public.empresa VALUES (20, 'EPAM Systems', '2026-05-19 19:08:29.8654-04', 1);
INSERT INTO public.empresa VALUES (21, 'Stefanini Group', '2026-05-19 19:14:58.973102-04', 1);
INSERT INTO public.empresa VALUES (22, 'Tata Consultancy Services', '2026-05-19 19:19:30.798098-04', 1);
INSERT INTO public.empresa VALUES (24, 'Agilistik', '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.empresa VALUES (25, 'Falabella', '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.empresa VALUES (26, 'Mercado Libre', '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.empresa VALUES (27, 'Bci', '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.empresa VALUES (28, 'Banco Estado', '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.empresa VALUES (35, 'frfrefefr', '2026-06-07 02:46:35.227896-04', 1);


--
-- TOC entry 5201 (class 0 OID 16413)
-- Dependencies: 224
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estado VALUES (1, 'En Espera', '#f59e0b', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.estado VALUES (2, 'Entrevista', '#3b82f6', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.estado VALUES (3, 'Rechazado', '#ef4444', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.estado VALUES (4, 'Finalizado', '#22c55e', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.estado VALUES (6, 'Pausa', '#6b7280', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.estado VALUES (7, 'Sin Postular', '#6366f1', '2026-05-19 18:11:43.152005-04', 1);
INSERT INTO public.estado VALUES (12, 'Entrazado', '#8b5cf6', '2026-06-03 00:27:15.842211-04', 1);


--
-- TOC entry 5219 (class 0 OID 16616)
-- Dependencies: 242
-- Data for Name: fase_seguimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fase_seguimiento VALUES (1, 'Postulación enviada', '#22c55e', 'send', 10, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (2, 'Contacto inicial', '#38bdf8', 'phone', 20, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (3, 'Prueba técnica', '#8b5cf6', 'file-code', 30, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (4, 'Entrevista RRHH', '#06b6d4', 'users', 40, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (5, 'Entrevista técnica', '#6366f1', 'monitor-code', 50, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (6, 'Entrevista final', '#f59e0b', 'handshake', 60, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (7, 'Feedback recibido', '#14b8a6', 'message-square', 70, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (8, 'Oferta recibida', '#eab308', 'badge-dollar-sign', 80, false, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (9, 'Rechazo', '#ef4444', 'x-circle', 90, true, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (10, 'Contratado', '#22c55e', 'badge-check', 100, true, '2026-06-08 02:31:08.834537');
INSERT INTO public.fase_seguimiento VALUES (11, 'Desistido', '#94a3b8', 'circle-slash', 110, true, '2026-06-08 02:31:08.834537');


--
-- TOC entry 5211 (class 0 OID 16494)
-- Dependencies: 234
-- Data for Name: metodo_evaluacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.metodo_evaluacion VALUES (1, 'Test Gorila', '#ef4444', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (2, 'Prueba Online', '#3b82f6', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (3, 'Prueba por Correo', '#f59e0b', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (4, 'Evalart', '#22c55e', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (5, 'Entrevista Técnica', '#8b5cf6', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (6, 'Coding Challenge', '#06b6d4', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.metodo_evaluacion VALUES (7, 'Pair Programming', '#ec4899', '2026-05-05 03:36:04.186483-04', 1);


--
-- TOC entry 5205 (class 0 OID 16443)
-- Dependencies: 228
-- Data for Name: modalidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.modalidad VALUES (1, 'Presencial', '#10b981', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.modalidad VALUES (2, 'Remoto', '#3b82f6', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.modalidad VALUES (3, 'Híbrido', '#f59e0b', '2026-05-05 03:36:04.186483-04', 1);


--
-- TOC entry 5217 (class 0 OID 16594)
-- Dependencies: 240
-- Data for Name: nivel_experiencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.nivel_experiencia VALUES (1, 'Trainee', 1, '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.nivel_experiencia VALUES (2, 'Junior', 2, '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.nivel_experiencia VALUES (3, 'Semi Senior', 3, '2026-06-03 00:27:15.842211-04', 1);
INSERT INTO public.nivel_experiencia VALUES (4, 'Senior', 4, '2026-06-03 00:27:15.842211-04', 1);


--
-- TOC entry 5203 (class 0 OID 16429)
-- Dependencies: 226
-- Data for Name: plataforma; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plataforma VALUES (1, 'Sin especificar', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (2, 'LinkedIn', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (3, 'GetOnBoard', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (4, 'InfoJobs', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (5, 'Indeed', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (6, 'Computrabajo', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (7, 'Laborum', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (8, 'Trabajando.com', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.plataforma VALUES (9, 'BNE', '2026-05-05 05:31:59.126183-04', 1);


--
-- TOC entry 5213 (class 0 OID 16510)
-- Dependencies: 236
-- Data for Name: postulacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.postulacion VALUES (22, 'erfeefr', 35, 9, 1, '232323', 9, 1, 1, NULL, 2222.00, '2026-06-07', '2026-06-10 04:41:01.489234-04', '2026-06-07 02:46:27.475318-04', NULL, 2, 3333.00, 1);
INSERT INTO public.postulacion VALUES (1, '', 9, 2, 1, 'https://www.getonbrd.com/empleos/programacion/full-stack-developer-node-js-react-witi-santiago', 3, 3, 2, NULL, NULL, '2026-05-05', '2026-06-10 04:41:01.489234-04', '2026-05-05 05:17:54.412117-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (2, '', 8, 2, 1, 'https://www.bne.cl/oferta/2026-052346', 9, NULL, 2, NULL, NULL, '2026-05-05', '2026-06-10 04:41:01.489234-04', '2026-05-05 05:39:13.693447-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (3, '', 10, 9, 1, 'https://www.getonbrd.com/empleos/otra/analista-de-automatizacion-y-datos-bc-tecnologia-santiago', 3, 3, 2, NULL, NULL, '2026-05-07', '2026-06-10 04:41:01.489234-04', '2026-05-07 06:24:44.729497-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (4, '', 1, 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-13', '2026-06-10 04:41:01.489234-04', '2026-05-13 05:47:09.527588-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (5, '', 10, 2, 1, 'https://www.getonbrd.com/applications?ref=sidebar_nav#b1a163f3d6e5fdcd7167157fe8fecdf2/job', 3, 3, 2, NULL, NULL, '2026-05-13', '2026-06-10 04:41:01.489234-04', '2026-05-13 06:38:12.445553-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (6, '', 11, 2, 1, 'https://www.linkedin.com/jobs/search/post-apply/next-best-action/?currentJobId=4413835730&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&postApplyJobId=4413835730&sortBy=DD&start=50', NULL, NULL, NULL, NULL, NULL, '2026-05-13', '2026-06-10 04:41:01.489234-04', '2026-05-13 07:02:33.641549-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (7, '', 12, 2, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4410315342&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=100', NULL, 3, 2, NULL, NULL, '2026-05-13', '2026-06-10 04:41:01.489234-04', '2026-05-13 07:04:45.327049-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (8, '', 12, 4, 1, 'https://www.bne.cl/postulantes/oferta/2026-058542', 9, NULL, NULL, NULL, NULL, '2026-05-13', '2026-06-10 04:41:01.489234-04', '2026-05-19 17:44:46.980963-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (9, '', 1, 11, 1, 'https://www.bne.cl/postulantes/oferta/2026-057725', NULL, NULL, NULL, NULL, NULL, '2026-05-12', '2026-06-10 04:41:01.489234-04', '2026-05-19 17:45:47.464289-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (10, '', 13, 6, 7, 'https://www.getonbrd.com/empleos/data-science-analytics/semi-senior-data-engineer-python-23people-remote', 3, 2, 2, NULL, 198.00, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:15:20.816491-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (11, '', 14, 2, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4413345882&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=25', NULL, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:23:12.445545-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (12, '', 12, 4, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4413358599&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=50', 2, 2, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:30:21.795336-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (13, '', 15, 4, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4416947125&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=100', 2, 2, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:33:15.866747-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (14, '', 16, 6, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4413339593&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=125', 2, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:41:47.465829-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (15, '', 17, 2, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4413376147&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=175', 2, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:44:35.696537-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (17, '', 19, 4, 1, 'https://www.getonbrd.com/jobs/programming/backend-developer-java-spring-boot-lisit-santiago', 3, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:55:06.386897-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (16, '', 18, 2, 7, 'https://www.linkedin.com/jobs/search/?currentJobId=4413321765&keywords=desarrollador&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=DD&start=275', 2, 2, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 18:49:18.782202-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (18, '', 20, 4, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4412801713&geoId=104621616&keywords=desarrollador&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=DD&start=625', 2, 2, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 19:09:26.640745-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (19, '', 21, 2, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4415673150&geoId=104621616&keywords=desarrollador&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=DD&start=650', NULL, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 19:14:47.539245-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (20, '', 17, 2, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4413376147&geoId=104621616&keywords=ingeniero%20de%20datos&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=DD', 2, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 19:17:19.928819-04', NULL, NULL, NULL, 1);
INSERT INTO public.postulacion VALUES (21, '', 22, 6, 1, 'https://www.linkedin.com/jobs/search/?currentJobId=4406637011&geoId=104621616&keywords=ingeniero%20de%20datos&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true&sortBy=DD&start=50', NULL, 3, 2, NULL, NULL, '2026-05-19', '2026-06-10 04:41:01.489234-04', '2026-05-19 19:20:41.110432-04', NULL, NULL, NULL, 1);


--
-- TOC entry 5215 (class 0 OID 16574)
-- Dependencies: 238
-- Data for Name: postulacion_metodo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.postulacion_metodo VALUES (22, 1);


--
-- TOC entry 5221 (class 0 OID 16635)
-- Dependencies: 244
-- Data for Name: postulacion_seguimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.postulacion_seguimiento VALUES (1, 22, 5, 5, NULL, NULL, '2026-06-08', NULL, 'pendiente', 50, '2026-06-08 03:12:06.703931', '2026-06-08 03:12:06.703931');
INSERT INTO public.postulacion_seguimiento VALUES (2, 22, 9, NULL, NULL, NULL, '2026-06-08', NULL, 'pendiente', 90, '2026-06-08 03:12:13.761166', '2026-06-08 03:12:13.761166');


--
-- TOC entry 5214 (class 0 OID 16557)
-- Dependencies: 237
-- Data for Name: postulacion_tecnologia; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.postulacion_tecnologia VALUES (18, 1);
INSERT INTO public.postulacion_tecnologia VALUES (18, 6);
INSERT INTO public.postulacion_tecnologia VALUES (18, 17);
INSERT INTO public.postulacion_tecnologia VALUES (1, 1);
INSERT INTO public.postulacion_tecnologia VALUES (1, 4);
INSERT INTO public.postulacion_tecnologia VALUES (1, 15);
INSERT INTO public.postulacion_tecnologia VALUES (1, 22);
INSERT INTO public.postulacion_tecnologia VALUES (19, 2);
INSERT INTO public.postulacion_tecnologia VALUES (19, 23);
INSERT INTO public.postulacion_tecnologia VALUES (19, 5);
INSERT INTO public.postulacion_tecnologia VALUES (19, 4);
INSERT INTO public.postulacion_tecnologia VALUES (19, 15);
INSERT INTO public.postulacion_tecnologia VALUES (19, 55);
INSERT INTO public.postulacion_tecnologia VALUES (19, 48);
INSERT INTO public.postulacion_tecnologia VALUES (2, 1);
INSERT INTO public.postulacion_tecnologia VALUES (2, 2);
INSERT INTO public.postulacion_tecnologia VALUES (2, 7);
INSERT INTO public.postulacion_tecnologia VALUES (2, 8);
INSERT INTO public.postulacion_tecnologia VALUES (2, 9);
INSERT INTO public.postulacion_tecnologia VALUES (2, 33);
INSERT INTO public.postulacion_tecnologia VALUES (2, 34);
INSERT INTO public.postulacion_tecnologia VALUES (3, 6);
INSERT INTO public.postulacion_tecnologia VALUES (4, 35);
INSERT INTO public.postulacion_tecnologia VALUES (5, 1);
INSERT INTO public.postulacion_tecnologia VALUES (5, 4);
INSERT INTO public.postulacion_tecnologia VALUES (5, 30);
INSERT INTO public.postulacion_tecnologia VALUES (5, 21);
INSERT INTO public.postulacion_tecnologia VALUES (5, 8);
INSERT INTO public.postulacion_tecnologia VALUES (19, 56);
INSERT INTO public.postulacion_tecnologia VALUES (20, 4);
INSERT INTO public.postulacion_tecnologia VALUES (20, 13);
INSERT INTO public.postulacion_tecnologia VALUES (20, 8);
INSERT INTO public.postulacion_tecnologia VALUES (20, 46);
INSERT INTO public.postulacion_tecnologia VALUES (6, 2);
INSERT INTO public.postulacion_tecnologia VALUES (6, 7);
INSERT INTO public.postulacion_tecnologia VALUES (6, 17);
INSERT INTO public.postulacion_tecnologia VALUES (6, 36);
INSERT INTO public.postulacion_tecnologia VALUES (20, 3);
INSERT INTO public.postulacion_tecnologia VALUES (21, 13);
INSERT INTO public.postulacion_tecnologia VALUES (21, 6);
INSERT INTO public.postulacion_tecnologia VALUES (21, 46);
INSERT INTO public.postulacion_tecnologia VALUES (7, 36);
INSERT INTO public.postulacion_tecnologia VALUES (7, 23);
INSERT INTO public.postulacion_tecnologia VALUES (7, 5);
INSERT INTO public.postulacion_tecnologia VALUES (7, 2);
INSERT INTO public.postulacion_tecnologia VALUES (8, 6);
INSERT INTO public.postulacion_tecnologia VALUES (8, 5);
INSERT INTO public.postulacion_tecnologia VALUES (21, 38);
INSERT INTO public.postulacion_tecnologia VALUES (21, 57);
INSERT INTO public.postulacion_tecnologia VALUES (21, 27);
INSERT INTO public.postulacion_tecnologia VALUES (22, 7);
INSERT INTO public.postulacion_tecnologia VALUES (10, 6);
INSERT INTO public.postulacion_tecnologia VALUES (10, 39);
INSERT INTO public.postulacion_tecnologia VALUES (10, 38);
INSERT INTO public.postulacion_tecnologia VALUES (10, 17);
INSERT INTO public.postulacion_tecnologia VALUES (10, 40);
INSERT INTO public.postulacion_tecnologia VALUES (11, 34);
INSERT INTO public.postulacion_tecnologia VALUES (11, 33);
INSERT INTO public.postulacion_tecnologia VALUES (11, 1);
INSERT INTO public.postulacion_tecnologia VALUES (11, 15);
INSERT INTO public.postulacion_tecnologia VALUES (11, 4);
INSERT INTO public.postulacion_tecnologia VALUES (11, 8);
INSERT INTO public.postulacion_tecnologia VALUES (11, 42);
INSERT INTO public.postulacion_tecnologia VALUES (11, 43);
INSERT INTO public.postulacion_tecnologia VALUES (11, 44);
INSERT INTO public.postulacion_tecnologia VALUES (11, 14);
INSERT INTO public.postulacion_tecnologia VALUES (11, 13);
INSERT INTO public.postulacion_tecnologia VALUES (12, 7);
INSERT INTO public.postulacion_tecnologia VALUES (12, 45);
INSERT INTO public.postulacion_tecnologia VALUES (12, 14);
INSERT INTO public.postulacion_tecnologia VALUES (22, 45);
INSERT INTO public.postulacion_tecnologia VALUES (22, 38);
INSERT INTO public.postulacion_tecnologia VALUES (13, 1);
INSERT INTO public.postulacion_tecnologia VALUES (13, 9);
INSERT INTO public.postulacion_tecnologia VALUES (13, 11);
INSERT INTO public.postulacion_tecnologia VALUES (13, 46);
INSERT INTO public.postulacion_tecnologia VALUES (13, 47);
INSERT INTO public.postulacion_tecnologia VALUES (13, 23);
INSERT INTO public.postulacion_tecnologia VALUES (13, 5);
INSERT INTO public.postulacion_tecnologia VALUES (14, 6);
INSERT INTO public.postulacion_tecnologia VALUES (14, 46);
INSERT INTO public.postulacion_tecnologia VALUES (14, 48);
INSERT INTO public.postulacion_tecnologia VALUES (14, 13);
INSERT INTO public.postulacion_tecnologia VALUES (15, 4);
INSERT INTO public.postulacion_tecnologia VALUES (15, 6);
INSERT INTO public.postulacion_tecnologia VALUES (15, 13);
INSERT INTO public.postulacion_tecnologia VALUES (15, 27);
INSERT INTO public.postulacion_tecnologia VALUES (15, 28);
INSERT INTO public.postulacion_tecnologia VALUES (15, 8);
INSERT INTO public.postulacion_tecnologia VALUES (15, 3);
INSERT INTO public.postulacion_tecnologia VALUES (15, 49);
INSERT INTO public.postulacion_tecnologia VALUES (16, 1);
INSERT INTO public.postulacion_tecnologia VALUES (16, 23);
INSERT INTO public.postulacion_tecnologia VALUES (16, 50);
INSERT INTO public.postulacion_tecnologia VALUES (16, 51);
INSERT INTO public.postulacion_tecnologia VALUES (16, 52);
INSERT INTO public.postulacion_tecnologia VALUES (16, 53);
INSERT INTO public.postulacion_tecnologia VALUES (17, 5);
INSERT INTO public.postulacion_tecnologia VALUES (17, 8);
INSERT INTO public.postulacion_tecnologia VALUES (17, 11);
INSERT INTO public.postulacion_tecnologia VALUES (17, 12);
INSERT INTO public.postulacion_tecnologia VALUES (17, 46);
INSERT INTO public.postulacion_tecnologia VALUES (17, 23);
INSERT INTO public.postulacion_tecnologia VALUES (17, 54);


--
-- TOC entry 5209 (class 0 OID 16473)
-- Dependencies: 232
-- Data for Name: tecnologia; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tecnologia VALUES (1, 'React', NULL, '#61dafb', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (2, 'Angular', NULL, '#dd0031', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (3, 'Vue', NULL, '#42b883', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (4, 'Node.js', NULL, '#68a063', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (5, 'Java', NULL, '#f89820', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (6, 'Python', NULL, '#3776ab', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (8, 'PostgreSQL', NULL, '#336791', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (9, 'MySQL', NULL, '#4479a1', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (10, 'MongoDB', NULL, '#47a248', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (11, 'Docker', NULL, '#2496ed', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (12, 'Kubernetes', NULL, '#326ce5', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (13, 'AWS', NULL, '#ff9900', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (14, 'Azure', NULL, '#0078d4', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (15, 'TypeScript', NULL, '#3178c6', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (16, 'JavaScript', NULL, '#f7df1e', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (17, 'Inglés', NULL, '#6b7280', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (18, 'Golang', NULL, '#00add8', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (19, 'Kotlin', NULL, '#7f52ff', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (20, 'Swift', NULL, '#fa7343', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (21, 'React Native', 1, '#61dafb', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (24, 'Hibernate', 5, '#59666c', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (25, 'Django', 6, '#092e20', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (26, 'FastAPI', 6, '#009688', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (27, 'AWS Lambda', 13, '#f59e0b', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (28, 'AWS S3', 13, '#f59e0b', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (29, 'Express.js', 4, '#68a063', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (30, 'NestJS', 4, '#e0234e', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (31, 'ASP.NET Core', 7, '#512bd4', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (32, 'Blazor', 7, '#512bd4', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (22, 'Next.js', 1, '#3b82f6', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (33, 'PHP', NULL, '#61dafb', '2026-05-05 05:36:53.250726-04', 0, 1);
INSERT INTO public.tecnologia VALUES (34, 'Laravel', 33, '#61dafb', '2026-05-05 05:37:06.195837-04', 0, 1);
INSERT INTO public.tecnologia VALUES (35, 'Soporte Técnico', NULL, '#61dafb', '2026-05-13 05:46:53.686318-04', 0, 1);
INSERT INTO public.tecnologia VALUES (36, 'Azure Service Bus', NULL, '#99e052', '2026-05-13 07:04:11.625212-04', 0, 1);
INSERT INTO public.tecnologia VALUES (37, 'Databricks', NULL, '#FF6D00', '2026-05-19 03:26:03.817287-04', 0, 1);
INSERT INTO public.tecnologia VALUES (38, 'Apache Spark', NULL, '#FF6D00', '2026-05-19 03:27:57.896152-04', 0, 1);
INSERT INTO public.tecnologia VALUES (39, 'Big Query', NULL, '#dce052', '2026-05-19 18:13:30.974127-04', 0, 1);
INSERT INTO public.tecnologia VALUES (40, 'Postman', NULL, '#52e05b', '2026-05-19 18:14:21.652504-04', 0, 1);
INSERT INTO public.tecnologia VALUES (41, 'Vercel', NULL, '#5254e0', '2026-05-19 18:19:13.714191-04', 0, 1);
INSERT INTO public.tecnologia VALUES (42, 'GraphQL', NULL, '#78e052', '2026-05-19 18:21:34.471471-04', 0, 1);
INSERT INTO public.tecnologia VALUES (43, 'Firebase', NULL, '#aa52e0', '2026-05-19 18:21:52.876344-04', 0, 1);
INSERT INTO public.tecnologia VALUES (44, 'Supabase', NULL, '#65e052', '2026-05-19 18:21:58.43328-04', 0, 1);
INSERT INTO public.tecnologia VALUES (45, 'C#', NULL, '#5112bd', '2026-05-19 18:28:44.47468-04', 0, 1);
INSERT INTO public.tecnologia VALUES (7, '.NET', 45, '#512bd4', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (46, 'SQL', NULL, '#5d52e0', '2026-05-19 18:32:34.987463-04', 0, 1);
INSERT INTO public.tecnologia VALUES (47, 'REDUX', NULL, '#52cbe0', '2026-05-19 18:32:49.847419-04', 0, 1);
INSERT INTO public.tecnologia VALUES (23, 'Spring Boot', 5, '#6db33f', '2026-05-05 03:36:04.186483-04', 0, 1);
INSERT INTO public.tecnologia VALUES (48, 'Git', NULL, '#94e052', '2026-05-19 18:41:28.412663-04', 0, 1);
INSERT INTO public.tecnologia VALUES (49, 'Bitbucket', NULL, '#c152e0', '2026-05-19 18:44:20.237187-04', 0, 1);
INSERT INTO public.tecnologia VALUES (50, 'Html', NULL, '#52e081', '2026-05-19 18:48:12.974761-04', 0, 1);
INSERT INTO public.tecnologia VALUES (51, 'Css', NULL, '#e0dc52', '2026-05-19 18:48:17.08211-04', 0, 1);
INSERT INTO public.tecnologia VALUES (52, 'JQuery', NULL, '#e052b6', '2026-05-19 18:48:24.666806-04', 0, 1);
INSERT INTO public.tecnologia VALUES (53, 'Saas', NULL, '#52e081', '2026-05-19 18:48:40.213266-04', 0, 1);
INSERT INTO public.tecnologia VALUES (54, 'GCP', NULL, '#e0ac52', '2026-05-19 18:53:40.555789-04', 0, 1);
INSERT INTO public.tecnologia VALUES (55, 'Kafka', NULL, '#7c52e0', '2026-05-19 19:14:28.671437-04', 0, 1);
INSERT INTO public.tecnologia VALUES (56, 'Gitflow', NULL, '#e0bd52', '2026-05-19 19:14:40.838666-04', 0, 1);
INSERT INTO public.tecnologia VALUES (57, 'PySpark', NULL, '#e0c952', '2026-05-19 19:20:23.249493-04', 0, 1);


--
-- TOC entry 5207 (class 0 OID 16459)
-- Dependencies: 230
-- Data for Name: ubicacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ubicacion VALUES (1, 'Sin especificar', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (2, 'Santiago', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (3, 'Valparaíso', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (4, 'Concepción', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (5, 'Viña del Mar', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (6, 'Antofagasta', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (7, 'Temuco', '2026-05-05 03:36:04.186483-04', 1);
INSERT INTO public.ubicacion VALUES (8, 'Remoto Internacional', '2026-05-05 03:36:04.186483-04', 1);


--
-- TOC entry 5223 (class 0 OID 16675)
-- Dependencies: 246
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'djaraestivill@gmail.com', '$2b$10$ZWSaWogYkuxGfck1tj9ma.FXEVTQn4chWKqGCQ0aVNl8ILNd52yOS', '2026-06-10 04:38:50.518357');


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 221
-- Name: cargo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargo_id_seq', 27, true);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 219
-- Name: empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresa_id_seq', 35, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 223
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 19, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 241
-- Name: fase_seguimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fase_seguimiento_id_seq', 11, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 233
-- Name: metodo_evaluacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodo_evaluacion_id_seq', 21, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 227
-- Name: modalidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modalidad_id_seq', 9, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 239
-- Name: nivel_experiencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nivel_experiencia_id_seq', 12, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 225
-- Name: plataforma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plataforma_id_seq', 25, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 235
-- Name: postulacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulacion_id_seq', 22, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 243
-- Name: postulacion_seguimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulacion_seguimiento_id_seq', 2, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 231
-- Name: tecnologia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tecnologia_id_seq', 121, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 229
-- Name: ubicacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ubicacion_id_seq', 24, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 245
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- TOC entry 4973 (class 2606 OID 16411)
-- Name: cargo cargo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_nombre_key UNIQUE (nombre);


--
-- TOC entry 4975 (class 2606 OID 16409)
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 16397)
-- Name: empresa empresa_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_nombre_key UNIQUE (nombre);


--
-- TOC entry 4971 (class 2606 OID 16395)
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16427)
-- Name: estado estado_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_nombre_key UNIQUE (nombre);


--
-- TOC entry 4979 (class 2606 OID 16425)
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 16633)
-- Name: fase_seguimiento fase_seguimiento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fase_seguimiento
    ADD CONSTRAINT fase_seguimiento_nombre_key UNIQUE (nombre);


--
-- TOC entry 5013 (class 2606 OID 16631)
-- Name: fase_seguimiento fase_seguimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fase_seguimiento
    ADD CONSTRAINT fase_seguimiento_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 16508)
-- Name: metodo_evaluacion metodo_evaluacion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion
    ADD CONSTRAINT metodo_evaluacion_nombre_key UNIQUE (nombre);


--
-- TOC entry 4999 (class 2606 OID 16506)
-- Name: metodo_evaluacion metodo_evaluacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion
    ADD CONSTRAINT metodo_evaluacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 16457)
-- Name: modalidad modalidad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad
    ADD CONSTRAINT modalidad_nombre_key UNIQUE (nombre);


--
-- TOC entry 4987 (class 2606 OID 16455)
-- Name: modalidad modalidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad
    ADD CONSTRAINT modalidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 16607)
-- Name: nivel_experiencia nivel_experiencia_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nivel_experiencia
    ADD CONSTRAINT nivel_experiencia_nombre_key UNIQUE (nombre);


--
-- TOC entry 5009 (class 2606 OID 16605)
-- Name: nivel_experiencia nivel_experiencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nivel_experiencia
    ADD CONSTRAINT nivel_experiencia_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16441)
-- Name: plataforma plataforma_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma
    ADD CONSTRAINT plataforma_nombre_key UNIQUE (nombre);


--
-- TOC entry 4983 (class 2606 OID 16439)
-- Name: plataforma plataforma_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma
    ADD CONSTRAINT plataforma_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 16580)
-- Name: postulacion_metodo postulacion_metodo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_pkey PRIMARY KEY (id_postulacion, id_metodo_evaluacion);


--
-- TOC entry 5001 (class 2606 OID 16524)
-- Name: postulacion postulacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 16655)
-- Name: postulacion_seguimiento postulacion_seguimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_seguimiento
    ADD CONSTRAINT postulacion_seguimiento_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 16563)
-- Name: postulacion_tecnologia postulacion_tecnologia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_pkey PRIMARY KEY (id_postulacion, id_tecnologia);


--
-- TOC entry 4993 (class 2606 OID 16487)
-- Name: tecnologia tecnologia_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_nombre_key UNIQUE (nombre);


--
-- TOC entry 4995 (class 2606 OID 16485)
-- Name: tecnologia tecnologia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 16471)
-- Name: ubicacion ubicacion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_nombre_key UNIQUE (nombre);


--
-- TOC entry 4991 (class 2606 OID 16469)
-- Name: ubicacion ubicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 16688)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 5022 (class 2606 OID 16686)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 1259 OID 16673)
-- Name: idx_postulacion_seguimiento_fase; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulacion_seguimiento_fase ON public.postulacion_seguimiento USING btree (id_fase_seguimiento);


--
-- TOC entry 5015 (class 1259 OID 16672)
-- Name: idx_postulacion_seguimiento_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulacion_seguimiento_fecha ON public.postulacion_seguimiento USING btree (fecha_evento);


--
-- TOC entry 5016 (class 1259 OID 16671)
-- Name: idx_postulacion_seguimiento_postulacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulacion_seguimiento_postulacion ON public.postulacion_seguimiento USING btree (id_postulacion);


--
-- TOC entry 5048 (class 2620 OID 16609)
-- Name: postulacion trg_postulacion_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_postulacion_updated BEFORE UPDATE ON public.postulacion FOR EACH ROW EXECUTE FUNCTION public.update_fecha_actualizacion();


--
-- TOC entry 5024 (class 2606 OID 16714)
-- Name: cargo fk_cargo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT fk_cargo_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 16709)
-- Name: empresa fk_empresa_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 16734)
-- Name: estado fk_estado_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT fk_estado_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5031 (class 2606 OID 16704)
-- Name: metodo_evaluacion fk_metodo_evaluacion_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion
    ADD CONSTRAINT fk_metodo_evaluacion_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5027 (class 2606 OID 16724)
-- Name: modalidad fk_modalidad_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad
    ADD CONSTRAINT fk_modalidad_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 16739)
-- Name: nivel_experiencia fk_nivel_experiencia_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nivel_experiencia
    ADD CONSTRAINT fk_nivel_experiencia_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 16719)
-- Name: plataforma fk_plataforma_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma
    ADD CONSTRAINT fk_plataforma_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5029 (class 2606 OID 16699)
-- Name: tecnologia fk_tecnologia_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT fk_tecnologia_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5028 (class 2606 OID 16729)
-- Name: ubicacion fk_ubicacion_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT fk_ubicacion_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 16689)
-- Name: postulacion fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 16530)
-- Name: postulacion postulacion_id_cargo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_cargo_fkey FOREIGN KEY (id_cargo) REFERENCES public.cargo(id) ON DELETE SET NULL;


--
-- TOC entry 5034 (class 2606 OID 16525)
-- Name: postulacion postulacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id) ON DELETE SET NULL;


--
-- TOC entry 5035 (class 2606 OID 16535)
-- Name: postulacion postulacion_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id);


--
-- TOC entry 5036 (class 2606 OID 16545)
-- Name: postulacion postulacion_id_modalidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_modalidad_fkey FOREIGN KEY (id_modalidad) REFERENCES public.modalidad(id) ON DELETE SET NULL;


--
-- TOC entry 5037 (class 2606 OID 16610)
-- Name: postulacion postulacion_id_nivel_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_nivel_fkey FOREIGN KEY (id_nivel) REFERENCES public.nivel_experiencia(id) ON DELETE SET NULL;


--
-- TOC entry 5038 (class 2606 OID 16540)
-- Name: postulacion postulacion_id_plataforma_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_plataforma_fkey FOREIGN KEY (id_plataforma) REFERENCES public.plataforma(id) ON DELETE SET NULL;


--
-- TOC entry 5039 (class 2606 OID 16550)
-- Name: postulacion postulacion_id_ubicacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_ubicacion_fkey FOREIGN KEY (id_ubicacion) REFERENCES public.ubicacion(id) ON DELETE SET NULL;


--
-- TOC entry 5042 (class 2606 OID 16586)
-- Name: postulacion_metodo postulacion_metodo_id_metodo_evaluacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_id_metodo_evaluacion_fkey FOREIGN KEY (id_metodo_evaluacion) REFERENCES public.metodo_evaluacion(id) ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 16581)
-- Name: postulacion_metodo postulacion_metodo_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulacion(id) ON DELETE CASCADE;


--
-- TOC entry 5045 (class 2606 OID 16661)
-- Name: postulacion_seguimiento postulacion_seguimiento_id_fase_seguimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_seguimiento
    ADD CONSTRAINT postulacion_seguimiento_id_fase_seguimiento_fkey FOREIGN KEY (id_fase_seguimiento) REFERENCES public.fase_seguimiento(id);


--
-- TOC entry 5046 (class 2606 OID 16666)
-- Name: postulacion_seguimiento postulacion_seguimiento_id_metodo_evaluacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_seguimiento
    ADD CONSTRAINT postulacion_seguimiento_id_metodo_evaluacion_fkey FOREIGN KEY (id_metodo_evaluacion) REFERENCES public.metodo_evaluacion(id);


--
-- TOC entry 5047 (class 2606 OID 16656)
-- Name: postulacion_seguimiento postulacion_seguimiento_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_seguimiento
    ADD CONSTRAINT postulacion_seguimiento_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulacion(id) ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 16564)
-- Name: postulacion_tecnologia postulacion_tecnologia_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulacion(id) ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 16569)
-- Name: postulacion_tecnologia postulacion_tecnologia_id_tecnologia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_id_tecnologia_fkey FOREIGN KEY (id_tecnologia) REFERENCES public.tecnologia(id) ON DELETE CASCADE;


--
-- TOC entry 5030 (class 2606 OID 16488)
-- Name: tecnologia tecnologia_id_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_id_padre_fkey FOREIGN KEY (id_padre) REFERENCES public.tecnologia(id) ON DELETE SET NULL;


-- Completed on 2026-06-18 18:23:55

--
-- PostgreSQL database dump complete
--

\unrestrict 1niiG0CqU38ItlTEuHMlIRCx0XelsIkiuIXcrxWNtgGAAIfvwAeyGKyXJRrKRsI

