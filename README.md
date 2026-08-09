# CrespoTrueké

Plataforma de intercambio comunitario (trueque de objetos, servicios, tiempo y conocimiento) para Crespo, Entre Ríos. Un proyecto de Fundación Elevar.

## Estado actual

Fase 1 (MVP) en construcción. Pantalla actual: **Splash**.

## Stack técnico

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 — paleta e identidad visual definidas en `app/globals.css`
- Base de datos: PostgreSQL vía [Supabase](https://supabase.com) (se conecta a partir de la etapa de Registro/Login)

## Correr en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

Cada pantalla del mapa aprobado (25 pantallas) vive como una carpeta dentro de `app/`. Ver `components/`, `lib/`, `styles/` y `public/` para piezas compartidas.
