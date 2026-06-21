--
-- PostgreSQL database dump
--

\restrict cPibIcLFZoDkUh8H7bybCqGZ0FrcoROUSvE5Oz8Ntw5CdgP4Ak3w8zgX48ZT9EN

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargo (
    id integer NOT NULL,
    nombre text NOT NULL,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cargo OWNER TO postgres;

--
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
-- Name: cargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargo_id_seq OWNED BY public.cargo.id;


--
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.empresa OWNER TO postgres;

--
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
-- Name: empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresa_id_seq OWNED BY public.empresa.id;


--
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.estado OWNER TO postgres;

--
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
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- Name: metodo_evaluacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodo_evaluacion (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.metodo_evaluacion OWNER TO postgres;

--
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
-- Name: metodo_evaluacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodo_evaluacion_id_seq OWNED BY public.metodo_evaluacion.id;


--
-- Name: modalidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modalidad (
    id integer NOT NULL,
    nombre text NOT NULL,
    color_hex text DEFAULT '#6b7280'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.modalidad OWNER TO postgres;

--
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
-- Name: modalidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modalidad_id_seq OWNED BY public.modalidad.id;


--
-- Name: plataforma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plataforma (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.plataforma OWNER TO postgres;

--
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
-- Name: plataforma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plataforma_id_seq OWNED BY public.plataforma.id;


--
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
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.postulacion OWNER TO postgres;

--
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
-- Name: postulacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulacion_id_seq OWNED BY public.postulacion.id;


--
-- Name: postulacion_metodo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion_metodo (
    id_postulacion integer NOT NULL,
    id_metodo_evaluacion integer NOT NULL
);


ALTER TABLE public.postulacion_metodo OWNER TO postgres;

--
-- Name: postulacion_tecnologia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulacion_tecnologia (
    id_postulacion integer NOT NULL,
    id_tecnologia integer NOT NULL
);


ALTER TABLE public.postulacion_tecnologia OWNER TO postgres;

--
-- Name: tecnologia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tecnologia (
    id integer NOT NULL,
    nombre text NOT NULL,
    id_padre integer,
    color_hex text DEFAULT '#61dafb'::text NOT NULL,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tecnologia OWNER TO postgres;

--
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
-- Name: tecnologia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tecnologia_id_seq OWNED BY public.tecnologia.id;


--
-- Name: ubicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ubicacion (
    id integer NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.ubicacion OWNER TO postgres;

--
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
-- Name: ubicacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ubicacion_id_seq OWNED BY public.ubicacion.id;


--
-- Name: cargo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo ALTER COLUMN id SET DEFAULT nextval('public.cargo_id_seq'::regclass);


--
-- Name: empresa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa ALTER COLUMN id SET DEFAULT nextval('public.empresa_id_seq'::regclass);


--
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- Name: metodo_evaluacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion ALTER COLUMN id SET DEFAULT nextval('public.metodo_evaluacion_id_seq'::regclass);


--
-- Name: modalidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad ALTER COLUMN id SET DEFAULT nextval('public.modalidad_id_seq'::regclass);


--
-- Name: plataforma id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma ALTER COLUMN id SET DEFAULT nextval('public.plataforma_id_seq'::regclass);


--
-- Name: postulacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion ALTER COLUMN id SET DEFAULT nextval('public.postulacion_id_seq'::regclass);


--
-- Name: tecnologia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia ALTER COLUMN id SET DEFAULT nextval('public.tecnologia_id_seq'::regclass);


--
-- Name: ubicacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion ALTER COLUMN id SET DEFAULT nextval('public.ubicacion_id_seq'::regclass);


--
-- Data for Name: cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cargo (id, nombre, created_at) FROM stdin;
1	Sin especificar	2026-05-05 03:36:04.186483-04
2	Full Stack Developer	2026-05-05 03:36:04.186483-04
3	Frontend Developer	2026-05-05 03:36:04.186483-04
4	Backend Developer	2026-05-05 03:36:04.186483-04
5	DevOps Engineer	2026-05-05 03:36:04.186483-04
6	Data Engineer	2026-05-05 03:36:04.186483-04
7	Mobile Developer	2026-05-05 03:36:04.186483-04
8	QA Engineer	2026-05-05 03:36:04.186483-04
\.


--
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa (id, nombre, created_at) FROM stdin;
1	Sin especificar	2026-05-05 03:36:04.186483-04
8	Confidencial	2026-05-05 05:31:13.349258-04
9	WITI	2026-05-05 05:31:16.021382-04
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado (id, nombre, color_hex, created_at) FROM stdin;
1	En Espera	#f59e0b	2026-05-05 03:36:04.186483-04
2	Entrevista	#3b82f6	2026-05-05 03:36:04.186483-04
3	Rechazado	#ef4444	2026-05-05 03:36:04.186483-04
4	Finalizado	#22c55e	2026-05-05 03:36:04.186483-04
5	Entrazado	#8b5cf6	2026-05-05 03:36:04.186483-04
6	Pausa	#6b7280	2026-05-05 03:36:04.186483-04
\.


--
-- Data for Name: metodo_evaluacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metodo_evaluacion (id, nombre, color_hex, created_at) FROM stdin;
1	Test Gorila	#ef4444	2026-05-05 03:36:04.186483-04
2	Prueba Online	#3b82f6	2026-05-05 03:36:04.186483-04
3	Prueba por Correo	#f59e0b	2026-05-05 03:36:04.186483-04
4	Evalart	#22c55e	2026-05-05 03:36:04.186483-04
5	Entrevista Técnica	#8b5cf6	2026-05-05 03:36:04.186483-04
6	Coding Challenge	#06b6d4	2026-05-05 03:36:04.186483-04
7	Pair Programming	#ec4899	2026-05-05 03:36:04.186483-04
\.


--
-- Data for Name: modalidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modalidad (id, nombre, color_hex, created_at) FROM stdin;
1	Presencial	#10b981	2026-05-05 03:36:04.186483-04
2	Remoto	#3b82f6	2026-05-05 03:36:04.186483-04
3	Híbrido	#f59e0b	2026-05-05 03:36:04.186483-04
\.


--
-- Data for Name: plataforma; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plataforma (id, nombre, created_at) FROM stdin;
1	Sin especificar	2026-05-05 03:36:04.186483-04
2	LinkedIn	2026-05-05 03:36:04.186483-04
3	GetOnBoard	2026-05-05 03:36:04.186483-04
4	InfoJobs	2026-05-05 03:36:04.186483-04
5	Indeed	2026-05-05 03:36:04.186483-04
6	Computrabajo	2026-05-05 03:36:04.186483-04
7	Laborum	2026-05-05 03:36:04.186483-04
8	Trabajando.com	2026-05-05 03:36:04.186483-04
9	BNE	2026-05-05 05:31:59.126183-04
\.


--
-- Data for Name: postulacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulacion (id, descripcion, id_empresa, id_cargo, id_estado, url, id_plataforma, id_modalidad, id_ubicacion, dias_presenciales, sueldo_ofrecido, fecha_postulacion, fecha_actualizacion, created_at) FROM stdin;
1		9	2	1	https://www.getonbrd.com/empleos/programacion/full-stack-developer-node-js-react-witi-santiago	3	3	2	\N	\N	2026-05-05	2026-05-05 05:31:24.773295-04	2026-05-05 05:17:54.412117-04
2		8	2	1	https://www.bne.cl/oferta/2026-052346	9	\N	2	\N	\N	2026-05-05	2026-05-05 05:39:25.899935-04	2026-05-05 05:39:13.693447-04
\.


--
-- Data for Name: postulacion_metodo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulacion_metodo (id_postulacion, id_metodo_evaluacion) FROM stdin;
\.


--
-- Data for Name: postulacion_tecnologia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postulacion_tecnologia (id_postulacion, id_tecnologia) FROM stdin;
1	1
1	4
1	15
1	22
2	1
2	2
2	7
2	8
2	9
2	33
2	34
\.


--
-- Data for Name: tecnologia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tecnologia (id, nombre, id_padre, color_hex, created_at) FROM stdin;
1	React	\N	#61dafb	2026-05-05 03:36:04.186483-04
2	Angular	\N	#dd0031	2026-05-05 03:36:04.186483-04
3	Vue	\N	#42b883	2026-05-05 03:36:04.186483-04
4	Node.js	\N	#68a063	2026-05-05 03:36:04.186483-04
5	Java	\N	#f89820	2026-05-05 03:36:04.186483-04
6	Python	\N	#3776ab	2026-05-05 03:36:04.186483-04
7	.NET	\N	#512bd4	2026-05-05 03:36:04.186483-04
8	PostgreSQL	\N	#336791	2026-05-05 03:36:04.186483-04
9	MySQL	\N	#4479a1	2026-05-05 03:36:04.186483-04
10	MongoDB	\N	#47a248	2026-05-05 03:36:04.186483-04
11	Docker	\N	#2496ed	2026-05-05 03:36:04.186483-04
12	Kubernetes	\N	#326ce5	2026-05-05 03:36:04.186483-04
13	AWS	\N	#ff9900	2026-05-05 03:36:04.186483-04
14	Azure	\N	#0078d4	2026-05-05 03:36:04.186483-04
15	TypeScript	\N	#3178c6	2026-05-05 03:36:04.186483-04
16	JavaScript	\N	#f7df1e	2026-05-05 03:36:04.186483-04
17	Inglés	\N	#6b7280	2026-05-05 03:36:04.186483-04
18	Golang	\N	#00add8	2026-05-05 03:36:04.186483-04
19	Kotlin	\N	#7f52ff	2026-05-05 03:36:04.186483-04
20	Swift	\N	#fa7343	2026-05-05 03:36:04.186483-04
21	React Native	1	#61dafb	2026-05-05 03:36:04.186483-04
23	Spring Boot	5	#6db33f	2026-05-05 03:36:04.186483-04
24	Hibernate	5	#59666c	2026-05-05 03:36:04.186483-04
25	Django	6	#092e20	2026-05-05 03:36:04.186483-04
26	FastAPI	6	#009688	2026-05-05 03:36:04.186483-04
27	AWS Lambda	13	#f59e0b	2026-05-05 03:36:04.186483-04
28	AWS S3	13	#f59e0b	2026-05-05 03:36:04.186483-04
29	Express.js	4	#68a063	2026-05-05 03:36:04.186483-04
30	NestJS	4	#e0234e	2026-05-05 03:36:04.186483-04
31	ASP.NET Core	7	#512bd4	2026-05-05 03:36:04.186483-04
32	Blazor	7	#512bd4	2026-05-05 03:36:04.186483-04
22	Next.js	1	#3b82f6	2026-05-05 03:36:04.186483-04
33	PHP	\N	#61dafb	2026-05-05 05:36:53.250726-04
34	Laravel	33	#61dafb	2026-05-05 05:37:06.195837-04
\.


--
-- Data for Name: ubicacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ubicacion (id, nombre, created_at) FROM stdin;
1	Sin especificar	2026-05-05 03:36:04.186483-04
2	Santiago	2026-05-05 03:36:04.186483-04
3	Valparaíso	2026-05-05 03:36:04.186483-04
4	Concepción	2026-05-05 03:36:04.186483-04
5	Viña del Mar	2026-05-05 03:36:04.186483-04
6	Antofagasta	2026-05-05 03:36:04.186483-04
7	Temuco	2026-05-05 03:36:04.186483-04
8	Remoto Internacional	2026-05-05 03:36:04.186483-04
\.


--
-- Name: cargo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargo_id_seq', 8, true);


--
-- Name: empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresa_id_seq', 9, true);


--
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 6, true);


--
-- Name: metodo_evaluacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodo_evaluacion_id_seq', 7, true);


--
-- Name: modalidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modalidad_id_seq', 3, true);


--
-- Name: plataforma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plataforma_id_seq', 9, true);


--
-- Name: postulacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulacion_id_seq', 2, true);


--
-- Name: tecnologia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tecnologia_id_seq', 34, true);


--
-- Name: ubicacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ubicacion_id_seq', 8, true);


--
-- Name: cargo cargo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_nombre_key UNIQUE (nombre);


--
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (id);


--
-- Name: empresa empresa_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_nombre_key UNIQUE (nombre);


--
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id);


--
-- Name: estado estado_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_nombre_key UNIQUE (nombre);


--
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- Name: metodo_evaluacion metodo_evaluacion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion
    ADD CONSTRAINT metodo_evaluacion_nombre_key UNIQUE (nombre);


--
-- Name: metodo_evaluacion metodo_evaluacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_evaluacion
    ADD CONSTRAINT metodo_evaluacion_pkey PRIMARY KEY (id);


--
-- Name: modalidad modalidad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad
    ADD CONSTRAINT modalidad_nombre_key UNIQUE (nombre);


--
-- Name: modalidad modalidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalidad
    ADD CONSTRAINT modalidad_pkey PRIMARY KEY (id);


--
-- Name: plataforma plataforma_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma
    ADD CONSTRAINT plataforma_nombre_key UNIQUE (nombre);


--
-- Name: plataforma plataforma_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataforma
    ADD CONSTRAINT plataforma_pkey PRIMARY KEY (id);


--
-- Name: postulacion_metodo postulacion_metodo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_pkey PRIMARY KEY (id_postulacion, id_metodo_evaluacion);


--
-- Name: postulacion postulacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_pkey PRIMARY KEY (id);


--
-- Name: postulacion_tecnologia postulacion_tecnologia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_pkey PRIMARY KEY (id_postulacion, id_tecnologia);


--
-- Name: tecnologia tecnologia_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_nombre_key UNIQUE (nombre);


--
-- Name: tecnologia tecnologia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_pkey PRIMARY KEY (id);


--
-- Name: ubicacion ubicacion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_nombre_key UNIQUE (nombre);


--
-- Name: ubicacion ubicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_pkey PRIMARY KEY (id);


--
-- Name: postulacion trg_postulacion_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_postulacion_updated BEFORE UPDATE ON public.postulacion FOR EACH ROW EXECUTE FUNCTION public.update_fecha_actualizacion();


--
-- Name: postulacion postulacion_id_cargo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_cargo_fkey FOREIGN KEY (id_cargo) REFERENCES public.cargo(id) ON DELETE SET NULL;


--
-- Name: postulacion postulacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id) ON DELETE SET NULL;


--
-- Name: postulacion postulacion_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id);


--
-- Name: postulacion postulacion_id_modalidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_modalidad_fkey FOREIGN KEY (id_modalidad) REFERENCES public.modalidad(id) ON DELETE SET NULL;


--
-- Name: postulacion postulacion_id_plataforma_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_plataforma_fkey FOREIGN KEY (id_plataforma) REFERENCES public.plataforma(id) ON DELETE SET NULL;


--
-- Name: postulacion postulacion_id_ubicacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion
    ADD CONSTRAINT postulacion_id_ubicacion_fkey FOREIGN KEY (id_ubicacion) REFERENCES public.ubicacion(id) ON DELETE SET NULL;


--
-- Name: postulacion_metodo postulacion_metodo_id_metodo_evaluacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_id_metodo_evaluacion_fkey FOREIGN KEY (id_metodo_evaluacion) REFERENCES public.metodo_evaluacion(id) ON DELETE CASCADE;


--
-- Name: postulacion_metodo postulacion_metodo_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_metodo
    ADD CONSTRAINT postulacion_metodo_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulacion(id) ON DELETE CASCADE;


--
-- Name: postulacion_tecnologia postulacion_tecnologia_id_postulacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_id_postulacion_fkey FOREIGN KEY (id_postulacion) REFERENCES public.postulacion(id) ON DELETE CASCADE;


--
-- Name: postulacion_tecnologia postulacion_tecnologia_id_tecnologia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulacion_tecnologia
    ADD CONSTRAINT postulacion_tecnologia_id_tecnologia_fkey FOREIGN KEY (id_tecnologia) REFERENCES public.tecnologia(id) ON DELETE CASCADE;


--
-- Name: tecnologia tecnologia_id_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tecnologia
    ADD CONSTRAINT tecnologia_id_padre_fkey FOREIGN KEY (id_padre) REFERENCES public.tecnologia(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict cPibIcLFZoDkUh8H7bybCqGZ0FrcoROUSvE5Oz8Ntw5CdgP4Ak3w8zgX48ZT9EN

