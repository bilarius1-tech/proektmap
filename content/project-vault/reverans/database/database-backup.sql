--
-- PostgreSQL database dump
--


-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: reverans_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO reverans_user;

--
-- Name: DocumentStatus; Type: TYPE; Schema: public; Owner: reverans_user
--

CREATE TYPE public."DocumentStatus" AS ENUM (
    'pending',
    'signed',
    'expired'
);


ALTER TYPE public."DocumentStatus" OWNER TO reverans_user;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: reverans_user
--

CREATE TYPE public."DocumentType" AS ENUM (
    'contract',
    'medical_clearance',
    'consent'
);


ALTER TYPE public."DocumentType" OWNER TO reverans_user;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: reverans_user
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'paid',
    'failed'
);


ALTER TYPE public."PaymentStatus" OWNER TO reverans_user;

--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: reverans_user
--

CREATE TYPE public."PaymentType" AS ENUM (
    'monthly',
    'individual'
);


ALTER TYPE public."PaymentType" OWNER TO reverans_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: reverans_user
--

CREATE TYPE public."Role" AS ENUM (
    'parent',
    'admin',
    'coach'
);


ALTER TYPE public."Role" OWNER TO reverans_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: children; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.children (
    id text NOT NULL,
    user_id text,
    full_name text NOT NULL,
    date_of_birth date,
    group_id text,
    price_per_month numeric(10,2) DEFAULT 0 NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    discount_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    invite_code text,
    is_budget boolean DEFAULT false NOT NULL
);


ALTER TABLE public.children OWNER TO reverans_user;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.documents (
    id text NOT NULL,
    child_id text NOT NULL,
    type public."DocumentType" NOT NULL,
    status public."DocumentStatus" DEFAULT 'pending'::public."DocumentStatus" NOT NULL,
    file_url text,
    signed_at timestamp(3) without time zone,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    file_name text,
    file_thumb_url text
);


ALTER TABLE public.documents OWNER TO reverans_user;

--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.gallery_items (
    id text NOT NULL,
    media_id text NOT NULL,
    caption text DEFAULT ''::text NOT NULL,
    alt text DEFAULT ''::text NOT NULL,
    category text DEFAULT 'Клуб'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    published boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO reverans_user;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.groups (
    id text NOT NULL,
    name text NOT NULL,
    coach_id text,
    default_price numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    coach2_id text
);


ALTER TABLE public.groups OWNER TO reverans_user;

--
-- Name: individual_trainings; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.individual_trainings (
    id text NOT NULL,
    child_id text NOT NULL,
    coach_id text NOT NULL,
    date date NOT NULL,
    "time" text NOT NULL,
    price numeric(10,2) NOT NULL,
    payment_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    package_id text
);


ALTER TABLE public.individual_trainings OWNER TO reverans_user;

--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.media_assets (
    id text NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    mime_type text NOT NULL,
    size_bytes integer NOT NULL,
    width integer,
    height integer,
    alt text DEFAULT ''::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    thumb_url text
);


ALTER TABLE public.media_assets OWNER TO reverans_user;

--
-- Name: page_seo; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.page_seo (
    id text NOT NULL,
    path text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    h1 text,
    og_title text,
    og_description text,
    og_image_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.page_seo OWNER TO reverans_user;

--
-- Name: payment_batches; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.payment_batches (
    id text NOT NULL,
    parent_user_id text NOT NULL,
    month text,
    amount numeric(10,2) NOT NULL,
    status public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    tbank_payment_id text,
    paid_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payment_batches OWNER TO reverans_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.payments (
    id text NOT NULL,
    child_id text NOT NULL,
    type public."PaymentType" NOT NULL,
    amount numeric(10,2) NOT NULL,
    month text,
    status public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    tbank_payment_id text,
    paid_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    batch_id text
);


ALTER TABLE public.payments OWNER TO reverans_user;

--
-- Name: site_sections; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.site_sections (
    id text NOT NULL,
    key text NOT NULL,
    label text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    data jsonb NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.site_sections OWNER TO reverans_user;

--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.site_settings (
    id text DEFAULT 'default'::text NOT NULL,
    brand_name text DEFAULT 'Reverence'::text NOT NULL,
    brand_name_ru text DEFAULT 'Реверанс'::text NOT NULL,
    tagline text DEFAULT 'Спортивный клуб художественной гимнастики'::text NOT NULL,
    city text DEFAULT 'Москва'::text NOT NULL,
    address text DEFAULT 'ул. Судостроительная, 44 стр. 1'::text NOT NULL,
    phone_display text DEFAULT '+7 (999) 623-13-01'::text NOT NULL,
    phone_href text DEFAULT 'tel:+79996231301'::text NOT NULL,
    email text,
    telegram text DEFAULT '@sc_reverence_rg'::text,
    telegram_href text DEFAULT 'https://t.me/sc_reverence_rg'::text,
    whatsapp_href text DEFAULT 'https://wa.me/79996231301'::text,
    instagram_href text DEFAULT 'https://www.instagram.com/sc_reverence_rg'::text,
    vk_href text,
    youtube_href text,
    logo_url text DEFAULT '/brand/logo.png'::text,
    favicon_url text,
    og_image_url text,
    footer_about text,
    copyright_text text,
    yandex_metrika_id text,
    yandex_metrika_on boolean DEFAULT false NOT NULL,
    yandex_webvisor boolean DEFAULT true NOT NULL,
    yandex_verification text,
    google_analytics_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.site_settings OWNER TO reverans_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: reverans_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text,
    name text NOT NULL,
    phone text,
    role public."Role" DEFAULT 'parent'::public."Role" NOT NULL,
    yandex_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO reverans_user;

--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: individual_trainings individual_trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.individual_trainings
    ADD CONSTRAINT individual_trainings_pkey PRIMARY KEY (id);


--
-- Name: media_assets media_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_pkey PRIMARY KEY (id);


--
-- Name: page_seo page_seo_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.page_seo
    ADD CONSTRAINT page_seo_pkey PRIMARY KEY (id);


--
-- Name: payment_batches payment_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.payment_batches
    ADD CONSTRAINT payment_batches_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: site_sections site_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.site_sections
    ADD CONSTRAINT site_sections_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: children_invite_code_key; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE UNIQUE INDEX children_invite_code_key ON public.children USING btree (invite_code);


--
-- Name: individual_trainings_package_id_idx; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE INDEX individual_trainings_package_id_idx ON public.individual_trainings USING btree (package_id);


--
-- Name: page_seo_path_key; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE UNIQUE INDEX page_seo_path_key ON public.page_seo USING btree (path);


--
-- Name: payment_batches_parent_user_id_month_idx; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE INDEX payment_batches_parent_user_id_month_idx ON public.payment_batches USING btree (parent_user_id, month);


--
-- Name: site_sections_key_key; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE UNIQUE INDEX site_sections_key_key ON public.site_sections USING btree (key);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_yandex_id_key; Type: INDEX; Schema: public; Owner: reverans_user
--

CREATE UNIQUE INDEX users_yandex_id_key ON public.users USING btree (yandex_id);


--
-- Name: children children_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: children children_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gallery_items gallery_items_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: groups groups_coach2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_coach2_id_fkey FOREIGN KEY (coach2_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: groups groups_coach_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: individual_trainings individual_trainings_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.individual_trainings
    ADD CONSTRAINT individual_trainings_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: individual_trainings individual_trainings_coach_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.individual_trainings
    ADD CONSTRAINT individual_trainings_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: individual_trainings individual_trainings_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.individual_trainings
    ADD CONSTRAINT individual_trainings_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_batches payment_batches_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.payment_batches
    ADD CONSTRAINT payment_batches_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.payment_batches(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: reverans_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


