--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-10-16 02:21:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- TOC entry 218 (class 1259 OID 16570)
-- Name: Articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Articles" (
    "Id" integer NOT NULL,
    "Title" character varying(255) NOT NULL,
    "PublishDate" timestamp with time zone
);


ALTER TABLE public."Articles" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16569)
-- Name: Articles_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Articles_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Articles_Id_seq" OWNER TO postgres;

--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 217
-- Name: Articles_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Articles_Id_seq" OWNED BY public."Articles"."Id";


--
-- TOC entry 227 (class 1259 OID 16632)
-- Name: Articles_Id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Articles" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Articles_Id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16635)
-- Name: Doppelgangers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Doppelgangers" (
    "Id" integer NOT NULL,
    "MushroomId" integer NOT NULL,
    "DoppelgangerName" character varying(100) NOT NULL
);


ALTER TABLE public."Doppelgangers" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16634)
-- Name: Doppelgangers_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Doppelgangers" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Doppelgangers_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16591)
-- Name: Mushrooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mushrooms" (
    "Id" integer NOT NULL,
    "Name" character varying(100) NOT NULL,
    "SynonymousName" character varying(100),
    "RedBook" boolean NOT NULL,
    "Eatable" character varying(15) NOT NULL,
    "HasStem" boolean NOT NULL,
    "StemSizeFrom" integer,
    "StemSizeTo" integer,
    "StemType" character varying(30),
    "SteamColor" character varying(100),
    "Description" text
);


ALTER TABLE public."Mushrooms" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16590)
-- Name: Mushrooms_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mushrooms_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mushrooms_Id_seq" OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 221
-- Name: Mushrooms_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mushrooms_Id_seq" OWNED BY public."Mushrooms"."Id";


--
-- TOC entry 228 (class 1259 OID 16633)
-- Name: Mushrooms_Id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Mushrooms" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Mushrooms_Id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16577)
-- Name: Paragraphs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Paragraphs" (
    "Id" integer NOT NULL,
    "ArticleId" integer,
    "ParagraphText" text,
    "SerialNumber" integer
);


ALTER TABLE public."Paragraphs" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16576)
-- Name: Paragraphs_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Paragraphs_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Paragraphs_Id_seq" OWNER TO postgres;

--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 219
-- Name: Paragraphs_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Paragraphs_Id_seq" OWNED BY public."Paragraphs"."Id";


--
-- TOC entry 226 (class 1259 OID 16626)
-- Name: Paragraphs_Id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Paragraphs" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Paragraphs_Id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16545)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    "Id" integer NOT NULL,
    "Name" character varying(30) NOT NULL
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16544)
-- Name: Roles_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Roles_Id_seq" OWNER TO postgres;

--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 215
-- Name: Roles_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_Id_seq" OWNED BY public."Roles"."Id";


--
-- TOC entry 225 (class 1259 OID 16625)
-- Name: Roles_Id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Roles" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Roles_Id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16614)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" integer NOT NULL,
    "Username" character varying(128) NOT NULL,
    "PasswordHash" character varying(128) NOT NULL,
    "RoleId" integer NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16619)
-- Name: Users_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Users" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Users_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4879 (class 0 OID 16570)
-- Dependencies: 218
-- Data for Name: Articles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4891 (class 0 OID 16635)
-- Dependencies: 230
-- Data for Name: Doppelgangers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4883 (class 0 OID 16591)
-- Dependencies: 222
-- Data for Name: Mushrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4881 (class 0 OID 16577)
-- Dependencies: 220
-- Data for Name: Paragraphs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4877 (class 0 OID 16545)
-- Dependencies: 216
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4884 (class 0 OID 16614)
-- Dependencies: 223
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 217
-- Name: Articles_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Articles_Id_seq"', 1, false);


--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 227
-- Name: Articles_Id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Articles_Id_seq1"', 1, false);


--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 229
-- Name: Doppelgangers_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Doppelgangers_Id_seq"', 1, false);


--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 221
-- Name: Mushrooms_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mushrooms_Id_seq"', 1, false);


--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 228
-- Name: Mushrooms_Id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mushrooms_Id_seq1"', 1, false);


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 219
-- Name: Paragraphs_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Paragraphs_Id_seq"', 1, false);


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 226
-- Name: Paragraphs_Id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Paragraphs_Id_seq1"', 1, false);


--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 215
-- Name: Roles_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_Id_seq"', 1, false);


--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 225
-- Name: Roles_Id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_Id_seq1"', 1, false);


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 224
-- Name: Users_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_Id_seq"', 1, false);


--
-- TOC entry 4722 (class 2606 OID 16575)
-- Name: Articles Articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articles"
    ADD CONSTRAINT "Articles_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4730 (class 2606 OID 16639)
-- Name: Doppelgangers Doppelgangers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doppelgangers"
    ADD CONSTRAINT "Doppelgangers_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4726 (class 2606 OID 16598)
-- Name: Mushrooms Mushrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mushrooms"
    ADD CONSTRAINT "Mushrooms_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4724 (class 2606 OID 16584)
-- Name: Paragraphs Paragraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Paragraphs"
    ADD CONSTRAINT "Paragraphs_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4718 (class 2606 OID 16552)
-- Name: Roles Roles_Name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_Name_key" UNIQUE ("Name");


--
-- TOC entry 4720 (class 2606 OID 16550)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4728 (class 2606 OID 16618)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4731 (class 2606 OID 16585)
-- Name: Paragraphs Paragraphs_ArticleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Paragraphs"
    ADD CONSTRAINT "Paragraphs_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES public."Articles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4732 (class 2606 OID 16627)
-- Name: Users Users_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"("Id");


-- Completed on 2024-10-16 02:21:03

--
-- PostgreSQL database dump complete
--

