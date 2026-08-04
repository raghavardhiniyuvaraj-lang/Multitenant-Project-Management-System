--
-- PostgreSQL database dump
--

\restrict YHmZICVo1tpqe7wAMfHnr2n1UL4ULUga7bn0wgb0V9jqLTozYUnBFQEMxHZvdOC

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-03 19:37:08

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 24654)
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    log_id integer NOT NULL,
    user_id integer,
    activity character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24653)
-- Name: activity_logs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_log_id_seq OWNER TO postgres;

--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 231
-- Name: activity_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_log_id_seq OWNED BY public.activity_logs.log_id;


--
-- TOC entry 228 (class 1259 OID 24615)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    project_id integer,
    user_id integer,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24614)
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO postgres;

--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- TOC entry 244 (class 1259 OID 24877)
-- Name: company_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_settings (
    setting_id integer NOT NULL,
    tenant_id integer,
    company_name character varying(255),
    company_email character varying(255),
    company_phone character varying(30),
    company_address text,
    company_logo character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company_settings OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24876)
-- Name: company_settings_setting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_settings_setting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_settings_setting_id_seq OWNER TO postgres;

--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 243
-- Name: company_settings_setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_settings_setting_id_seq OWNED BY public.company_settings.setting_id;


--
-- TOC entry 226 (class 1259 OID 24581)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id integer NOT NULL,
    tenant_id integer,
    department_name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text,
    status character varying(20) DEFAULT 'Active'::character varying
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24580)
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_department_id_seq OWNER TO postgres;

--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- TOC entry 234 (class 1259 OID 24695)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    tenant_id integer NOT NULL,
    department_id integer,
    employee_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15),
    designation character varying(100),
    salary numeric(10,2),
    joining_date date DEFAULT CURRENT_DATE,
    status character varying(20) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24694)
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_employee_id_seq OWNER TO postgres;

--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 233
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- TOC entry 224 (class 1259 OID 16462)
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    file_id integer NOT NULL,
    tenant_id integer,
    uploaded_by integer,
    file_name character varying(255),
    file_url text,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.files OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16461)
-- Name: files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_file_id_seq OWNER TO postgres;

--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 223
-- Name: files_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_file_id_seq OWNED BY public.files.file_id;


--
-- TOC entry 230 (class 1259 OID 24637)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    tenant_id integer,
    title character varying(200),
    message text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24636)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 240 (class 1259 OID 24829)
-- Name: project_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_members (
    member_id integer NOT NULL,
    tenant_id integer NOT NULL,
    project_id integer NOT NULL,
    employee_id integer NOT NULL,
    role character varying(100),
    assigned_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.project_members OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24828)
-- Name: project_members_member_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_members_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_members_member_id_seq OWNER TO postgres;

--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 239
-- Name: project_members_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_members_member_id_seq OWNED BY public.project_members.member_id;


--
-- TOC entry 238 (class 1259 OID 24815)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    project_id integer NOT NULL,
    tenant_id integer NOT NULL,
    project_name character varying(100) NOT NULL,
    description text,
    start_date date,
    end_date date,
    status character varying(20) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24814)
-- Name: projects_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_project_id_seq OWNER TO postgres;

--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 237
-- Name: projects_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_project_id_seq OWNED BY public.projects.project_id;


--
-- TOC entry 242 (class 1259 OID 24865)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    tenant_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    report_type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24864)
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO postgres;

--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 241
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- TOC entry 236 (class 1259 OID 24767)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    task_id integer NOT NULL,
    tenant_id integer NOT NULL,
    project_id integer NOT NULL,
    employee_id integer NOT NULL,
    task_name character varying(150) NOT NULL,
    description text,
    priority character varying(20) DEFAULT 'Medium'::character varying,
    status character varying(30) DEFAULT 'Pending'::character varying,
    due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 24766)
-- Name: tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_task_id_seq OWNER TO postgres;

--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 235
-- Name: tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    tenant_id integer NOT NULL,
    tenant_name character varying(100) NOT NULL,
    email character varying(100),
    subscription_plan character varying(50) DEFAULT 'Free'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    logo character varying(255),
    phone character varying(20),
    address text,
    website character varying(255),
    theme_color character varying(20) DEFAULT '#0d6efd'::character varying,
    status character varying(20) DEFAULT 'Active'::character varying
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: tenants_tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenants_tenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_tenant_id_seq OWNER TO postgres;

--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 219
-- Name: tenants_tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenants_tenant_id_seq OWNED BY public.tenants.tenant_id;


--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    tenant_id integer,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'Employee'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone character varying(20),
    profile_photo text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4934 (class 2604 OID 24657)
-- Name: activity_logs log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN log_id SET DEFAULT nextval('public.activity_logs_log_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 24618)
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 24880)
-- Name: company_settings setting_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings ALTER COLUMN setting_id SET DEFAULT nextval('public.company_settings_setting_id_seq'::regclass);


--
-- TOC entry 4926 (class 2604 OID 24584)
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 24698)
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 16465)
-- Name: files file_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN file_id SET DEFAULT nextval('public.files_file_id_seq'::regclass);


--
-- TOC entry 4931 (class 2604 OID 24640)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 24832)
-- Name: project_members member_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members ALTER COLUMN member_id SET DEFAULT nextval('public.project_members_member_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 24818)
-- Name: projects project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN project_id SET DEFAULT nextval('public.projects_project_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 24868)
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 24770)
-- Name: tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 16393)
-- Name: tenants tenant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants ALTER COLUMN tenant_id SET DEFAULT nextval('public.tenants_tenant_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 16406)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5162 (class 0 OID 24654)
-- Dependencies: 232
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (log_id, user_id, activity, created_at) FROM stdin;
\.


--
-- TOC entry 5158 (class 0 OID 24615)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (comment_id, project_id, user_id, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5174 (class 0 OID 24877)
-- Dependencies: 244
-- Data for Name: company_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_settings (setting_id, tenant_id, company_name, company_email, company_phone, company_address, company_logo, created_at) FROM stdin;
1	2	ABC Technologies	abc@gmail.com	9876543210	Coimbatore	1785587118002.png	2026-08-01 15:00:49.358051
\.


--
-- TOC entry 5156 (class 0 OID 24581)
-- Dependencies: 226
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (department_id, tenant_id, department_name, created_at, description, status) FROM stdin;
2	1	Human Resource	2026-07-11 15:32:19.582992	Handles employees	Active
3	2	Finance	2026-07-13 18:47:47.288949	Handles company accounts	Active
5	2	HR	2026-07-14 20:30:32.068064	manage and handle employees	Active
6	2	UI/Ux	2026-07-14 20:32:40.601853	create user friendly interfaces	Active
7	2	cloud & DevOps	2026-07-14 20:33:45.846044	manage the cloud infrastructure , deployment,CI/CD pipelines	Active
\.


--
-- TOC entry 5164 (class 0 OID 24695)
-- Dependencies: 234
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, tenant_id, department_id, employee_name, email, phone, designation, salary, joining_date, status, created_at) FROM stdin;
2	1	2	Raghav	raghav@gmail.com	9876543210	Software Engineer	45000.00	2026-07-11	Active	2026-07-11 15:33:26.905855
8	2	3	seetha	seetha123@gmail.com	9876540321	Software developer	50000.00	2026-07-14	Active	2026-07-14 20:22:01.174488
11	2	6	Soundharya	soundharya12@gmail.com	7456321908	 design the software	60000.00	2026-07-14	Active	2026-07-14 20:35:08.857146
12	2	7	raghavi	raghavi123@gmail.com	7418185715	cloud computing	60000.00	2026-07-14	Active	2026-07-14 20:36:21.904047
10	2	3	bharanika	bharani56@gmail.com	7654320189	cashier	30000.00	2026-07-14	Active	2026-07-14 20:26:15.504584
\.


--
-- TOC entry 5154 (class 0 OID 16462)
-- Dependencies: 224
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (file_id, tenant_id, uploaded_by, file_name, file_url, uploaded_at) FROM stdin;
\.


--
-- TOC entry 5160 (class 0 OID 24637)
-- Dependencies: 230
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, tenant_id, title, message, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 5170 (class 0 OID 24829)
-- Dependencies: 240
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_members (member_id, tenant_id, project_id, employee_id, role, assigned_date) FROM stdin;
2	2	10	2	Developer	2026-07-16
3	2	10	11	Team Lead	2026-07-18
4	2	11	10	developer	2026-07-20
\.


--
-- TOC entry 5168 (class 0 OID 24815)
-- Dependencies: 238
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (project_id, tenant_id, project_name, description, start_date, end_date, status, created_at) FROM stdin;
11	2	Online Shopping System	E-commerce web application	2026-07-20	2026-10-15	Active	2026-07-18 17:29:57.892286
10	2	Employee Management System	Manage employees records,performance and attendance 	2026-07-13	2026-09-29	Active	2026-07-15 21:27:09.107216
13	2	Pet Care System	manage the pets health and condition	2026-07-18	2026-09-30	Active	2026-07-18 20:07:33.611169
\.


--
-- TOC entry 5172 (class 0 OID 24865)
-- Dependencies: 242
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (report_id, tenant_id, file_name, report_type, created_at) FROM stdin;
17	2	Company_Report_1785597107591.pdf	PDF	2026-08-01 20:41:47.760119
18	2	Company_Report_1785597122366.pdf	PDF	2026-08-01 20:42:02.433631
19	2	Company_Report_1785597339074.pdf	PDF	2026-08-01 20:45:39.170447
20	2	Company_Report_1785672535437.pdf	PDF	2026-08-02 17:38:55.729273
21	2	Company_Report_1785674331136.pdf	PDF	2026-08-02 18:08:51.434297
22	2	Company_Report_1785676735300.pdf	PDF	2026-08-02 18:48:55.403637
23	2	Company_Report_1785677083611.pdf	PDF	2026-08-02 18:54:43.682072
24	2	Company_Report_1785678804336.pdf	PDF	2026-08-02 19:23:24.467823
25	2	Company_Report_1785679134116.pdf	PDF	2026-08-02 19:28:54.2562
26	2	Company_Report_1785679165101.pdf	PDF	2026-08-02 19:29:25.288788
27	2	Company_Report_1785681642750.pdf	PDF	2026-08-02 20:10:42.948786
28	2	Company_Report_1785682425481.pdf	PDF	2026-08-02 20:23:45.596036
29	2	Company_Report_1785682910132.pdf	PDF	2026-08-02 20:31:50.27428
30	2	Company_Report_1785744714149.pdf	PDF	2026-08-03 13:41:54.32666
31	2	Company_Report_1785745337102.pdf	PDF	2026-08-03 13:52:17.217457
32	2	Company_Report_1785745398512.pdf	PDF	2026-08-03 13:53:18.650895
33	2	Company_Report_1785745629036.pdf	PDF	2026-08-03 13:57:09.18722
34	2	Company_Report_1785746044166.pdf	PDF	2026-08-03 14:04:04.33242
35	2	Company_Report_1785746807081.pdf	PDF	2026-08-03 14:16:47.293073
36	2	Company_Report_1785747332299.pdf	PDF	2026-08-03 14:25:32.447581
37	2	Company_Report_1785748431480.pdf	PDF	2026-08-03 14:43:51.630026
38	2	Company_Report_1785748728073.pdf	PDF	2026-08-03 14:48:48.211889
\.


--
-- TOC entry 5166 (class 0 OID 24767)
-- Dependencies: 236
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (task_id, tenant_id, project_id, employee_id, task_name, description, priority, status, due_date, created_at) FROM stdin;
4	2	11	10	Payment Module	Implement payment gateway	Medium	Pending	2026-07-29	2026-07-18 18:01:59.575633
2	1	10	2	Develop Login API	Create secure login API using JWT	High	Pending	2026-07-25	2026-07-11 19:48:24.907122
5	2	10	11	attendance module		Medium	Completed	2026-07-25	2026-07-18 18:19:19.174601
\.


--
-- TOC entry 5150 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (tenant_id, tenant_name, email, subscription_plan, created_at, logo, phone, address, website, theme_color, status) FROM stdin;
1	ABC Company	admin@abc.com	Free	2026-07-08 18:13:16.491243	\N	\N	\N	\N	#0d6efd	Active
3	eyr company	raghavardhiniyuvaraj@gmail.com	Free	2026-07-13 18:37:26.757399	\N	\N	\N	\N	#0d6efd	Active
2	ABC Company	raghav@gmail.com	Free	2026-07-12 16:15:59.117476	uploads/company/1784981826581-Logo1.png	9876543210	\N	\N	#0ac7a1	Active
\.


--
-- TOC entry 5152 (class 0 OID 16403)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, tenant_id, username, email, password, role, created_at, phone, profile_photo) FROM stdin;
1	1	admin	admin@abc.com	$2b$10$Q/Jk2HydaB6tTXQQfM9XO.ZQ1Se1tJay960KdmuqCrMRYKRE9Zm0C	Admin	2026-07-08 18:13:16.607396	\N	\N
3	3	raghavi	raghavardhiniyuvaraj@gmail.com	$2b$10$yQ2BQrsIck9G.m3GXFYJHu32T.xk8f68vYishnAy0VcWFKO1gGEVi	Admin	2026-07-13 18:37:26.837266	\N	\N
2	2	Raghav	raghav@gmail.com	$2b$10$4mGtdM0eg2UhP/Q6bdD/muIibyUwowtikcPdxNJuF8t7y.VNID99G	Admin	2026-07-12 16:15:59.230924	9876543210	uploads/profile/1784726821108-profile.png
\.


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 231
-- Name: activity_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_log_id_seq', 1, false);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 1, false);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 243
-- Name: company_settings_setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_settings_setting_id_seq', 1, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 7, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 233
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 13, true);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 223
-- Name: files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_file_id_seq', 1, false);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- TOC entry 5200 (class 0 OID 0)
-- Dependencies: 239
-- Name: project_members_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_members_member_id_seq', 4, true);


--
-- TOC entry 5201 (class 0 OID 0)
-- Dependencies: 237
-- Name: projects_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_project_id_seq', 13, true);


--
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 241
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_report_id_seq', 38, true);


--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 235
-- Name: tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_task_id_seq', 6, true);


--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 219
-- Name: tenants_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_tenant_id_seq', 3, true);


--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 4970 (class 2606 OID 24661)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4966 (class 2606 OID 24625)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 4984 (class 2606 OID 24886)
-- Name: company_settings company_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_pkey PRIMARY KEY (setting_id);


--
-- TOC entry 4986 (class 2606 OID 24888)
-- Name: company_settings company_settings_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_tenant_id_key UNIQUE (tenant_id);


--
-- TOC entry 4964 (class 2606 OID 24589)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- TOC entry 4972 (class 2606 OID 24709)
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- TOC entry 4974 (class 2606 OID 24707)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 4962 (class 2606 OID 16471)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (file_id);


--
-- TOC entry 4968 (class 2606 OID 24647)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4980 (class 2606 OID 24839)
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (member_id);


--
-- TOC entry 4978 (class 2606 OID 24827)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- TOC entry 4982 (class 2606 OID 24875)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- TOC entry 4976 (class 2606 OID 24782)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);


--
-- TOC entry 4954 (class 2606 OID 16401)
-- Name: tenants tenants_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_email_key UNIQUE (email);


--
-- TOC entry 4956 (class 2606 OID 16399)
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4958 (class 2606 OID 16418)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4960 (class 2606 OID 16416)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4993 (class 2606 OID 24662)
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4991 (class 2606 OID 24631)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5001 (class 2606 OID 24889)
-- Name: company_settings company_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4990 (class 2606 OID 24590)
-- Name: departments departments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


--
-- TOC entry 4994 (class 2606 OID 24715)
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE SET NULL;


--
-- TOC entry 4995 (class 2606 OID 24710)
-- Name: employees employees_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4988 (class 2606 OID 16472)
-- Name: files files_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


--
-- TOC entry 4989 (class 2606 OID 16477)
-- Name: files files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id);


--
-- TOC entry 4992 (class 2606 OID 24648)
-- Name: notifications notifications_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


--
-- TOC entry 4998 (class 2606 OID 24850)
-- Name: project_members project_members_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- TOC entry 4999 (class 2606 OID 24845)
-- Name: project_members project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- TOC entry 5000 (class 2606 OID 24840)
-- Name: project_members project_members_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4996 (class 2606 OID 24793)
-- Name: tasks tasks_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- TOC entry 4997 (class 2606 OID 24783)
-- Name: tasks tasks_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id) ON DELETE CASCADE;


--
-- TOC entry 4987 (class 2606 OID 16419)
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


-- Completed on 2026-08-03 19:37:09

--
-- PostgreSQL database dump complete
--

\unrestrict YHmZICVo1tpqe7wAMfHnr2n1UL4ULUga7bn0wgb0V9jqLTozYUnBFQEMxHZvdOC

