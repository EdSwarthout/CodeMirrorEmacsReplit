--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Name: editor_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.editor_settings (
    id integer NOT NULL,
    theme text DEFAULT 'light'::text NOT NULL,
    font_size integer DEFAULT 14 NOT NULL,
    line_numbers boolean DEFAULT true NOT NULL,
    word_wrap boolean DEFAULT false NOT NULL,
    emacs_mode boolean DEFAULT true NOT NULL
);


ALTER TABLE public.editor_settings OWNER TO neondb_owner;

--
-- Name: editor_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.editor_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.editor_settings_id_seq OWNER TO neondb_owner;

--
-- Name: editor_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.editor_settings_id_seq OWNED BY public.editor_settings.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.files (
    id integer NOT NULL,
    name text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    language text DEFAULT 'javascript'::text NOT NULL,
    path text NOT NULL
);


ALTER TABLE public.files OWNER TO neondb_owner;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO neondb_owner;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: editor_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.editor_settings ALTER COLUMN id SET DEFAULT nextval('public.editor_settings_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Data for Name: editor_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.editor_settings (id, theme, font_size, line_numbers, word_wrap, emacs_mode) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.files (id, name, content, language, path) FROM stdin;
2	styles.css	/* Sample CSS file */\nbody {\n    font-family: 'Inter', sans-serif;\n    margin: 0;\n    padding: 0;\n    background-color: #f9fafb;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}	css	/styles.css
3	sample.md	# CodeMirror Emacs Editor\n\nA powerful web-based code editor with Emacs keybindings.\n\n## Features\n\n- CodeMirror 6 integration\n- Emacs keybindings  \n- Multiple language support\n- File management\n- Customizable settings\n\n## Usage\n\nUse Emacs keybindings for efficient text editing:\n- `Ctrl+x Ctrl+s` - Save file\n- `Ctrl+x Ctrl+f` - Open file\n- `Ctrl+x k` - Close file\n- `Ctrl+g` - Cancel operation	markdown	/sample.md
4	untitled-1.js		javascript	/untitled-1.js
1	index.js	// Welcome to CodeMirror Emacs Editor\nfunction greetUser(name) {\n    const message = `Hello, ${name}!`;\n    console.log(message);\n    return message;\n}\nconsole.log("yes");\n// Example usage\ngreetUser('World');	javascript	/index.js
\.


--
-- Name: editor_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.editor_settings_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.files_id_seq', 4, true);


--
-- Name: editor_settings editor_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.editor_settings
    ADD CONSTRAINT editor_settings_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

