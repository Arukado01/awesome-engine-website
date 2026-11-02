# Awesome Engine · Sitio oficial

Sitio de presentación, documentación y evolución de **Awesome Engine**, el motor 2D en C++ de Carlos Cortina. Este proyecto web es independiente del [repositorio del motor](https://github.com/Arukado01/AwesomeEngine): no compila, modifica ni distribuye su ejecutable.

- **Destino de producción:** [awesome-engine-web-arukado.web.app](https://awesome-engine-web-arukado.web.app).
- **Código del sitio:** [Arukado01/awesome-engine-website](https://github.com/Arukado01/awesome-engine-website).
- **Proyecto Firebase:** `awesome-engine-web-arukado`.

## Qué incluye

Presentación del motor, capacidades verificadas, arquitectura, galería, nueve guías técnicas y una línea de tiempo alimentada por datos centralizados. El sitio ofrece temas claro, oscuro y sistema, navegación adaptable, búsqueda de documentación, metadatos sociales, sitemap y página 404.

El contenido técnico se basa en la auditoría de la revisión `5a6dfacd86414c4cdfaa7157b533330f173a3126`. Las funciones observadas únicamente en el árbol local se identifican como trabajo en desarrollo. No se anuncian versiones ni capacidades sin evidencia.

El formulario tiene validación y un backend preparado para Gmail SMTP, Turnstile y límites de abuso. **El envío real requiere configuración externa y despliegue del backend.** Por defecto está desactivado y nunca muestra éxito por simular un envío. Consulta [la integración de contacto](docs/CONTACT.md) y [el procedimiento de despliegue](docs/DEPLOYMENT.md).

## Showcase real

Incluye 10 capturas PNG y cuatro videos H.264: Runner (35 y 25 segundos, 800 × 800) y Plaguefront (40 y 29 segundos, 1440 × 900). Las grabaciones conservan velocidad y proporciones originales y no incluyen audio. Las galerías y los reproductores están verificados en móvil, tablet y escritorio. Procedencia y comandos: [CAPTURE.md](docs/CAPTURE.md).

## Stack

- Astro con generación estática y TypeScript.
- CSS con tokens de diseño y JavaScript limitado a interacciones.
- Markdown para documentación; TypeScript para datos del motor e historial.
- Fuentes Inter y Space Grotesk mediante Fontsource.
- Firebase Hosting; Cloud Functions Node.js 22 opcionales para contacto.
- Firestore para metadatos de límite de uso e idempotencia del backend.
- GitHub Actions para validación, producción y canales de preview.

Las versiones reproducibles están fijadas en los dos archivos `package-lock.json`.

## Preparar el entorno

Requisitos: **Node.js 22.23.4 o posterior** (CI y Functions usan Node 22; desarrollo validado con Node 24), npm y Git. Firebase CLI se necesita únicamente para emulación o despliegue; la versión usada por CI es 15.31.0.

```sh
git clone https://github.com/Arukado01/awesome-engine-website.git
cd awesome-engine-website
npm ci
npm --prefix functions ci
```

Copia `.env.example` a `.env` solo si necesitas ajustar opciones locales. No introduzcas contraseñas o claves privadas en variables `PUBLIC_*`: sus valores terminan en el navegador.

```sh
npm run dev
```

Astro imprime la URL local. Para comprobar los archivos de producción:

```sh
npm run build
npm run preview
```

El resultado estático queda en `dist/`. El servidor de desarrollo no ejecuta Cloud Functions.

## Validación

```sh
npm run check
npm run lint
npm test
npm run build
npm --prefix functions run check
```

El último comando valida tipos, lint, pruebas y compilación del backend. Las pruebas del envío usan dependencias controladas; no acreditan por sí solas recepción de un correo real.

La suite de navegador comprueba navegación, responsive, temas, documentación, formulario, medios y accesibilidad básica con Playwright y axe:

```sh
npm run test:e2e
```

En local utiliza Chrome instalado y arranca el servidor de desarrollo automáticamente. Ejecuta estas pruebas con `PUBLIC_CONTACT_ENABLED=false` y `PUBLIC_TURNSTILE_SITE_KEY` vacío; los escenarios del formulario utilizan respuestas controladas. CI instala Chromium con `npx playwright install --with-deps chromium` y fija esas variables únicamente en el paso de pruebas, conservando la configuración de la build de producción. Los fallos adjuntan diagnósticos disponibles a la ejecución de Actions durante siete días. Las revisiones visuales manuales complementan estos controles.

## Organización

```text
src/
  components/         Componentes reutilizables
  layouts/            Estructura común y metadatos
  pages/              Rutas y documentos renderizados
  styles/             Tokens y estilos
  scripts/            Interacciones y formulario
  content/docs/       Guías Markdown con frontmatter
  data/engine.ts      Juegos, tecnologías y trabajo en desarrollo
  data/updates.ts     Historial central de mejoras
public/               Imágenes, favicon y recursos estáticos
functions/            Endpoint de contacto y pruebas
scripts/              Herramientas del proyecto
tests/                Verificaciones del sitio
.github/workflows/    Integración y despliegue continuos
docs/                 Auditoría, procedencia y operación
```

`firebase.json` publica exclusivamente Hosting. `firebase.functions.json` es la configuración alternativa para habilitar el backend de forma explícita. Ningún workflow despliega funciones ni cambia facturación automáticamente.

## Actualizar documentación y novedades

Para una guía, edita o añade un archivo en `src/content/docs/`:

```yaml
---
title: Título de la guía
description: Qué permite consultar esta página.
order: 10
category: Sistemas
---
```

Mantén órdenes únicos y enlaces a commits concretos del motor. Para una novedad, añade una entrada en `src/data/updates.ts` con `id`, `date`, `title`, `description`, `category`, `status`, `added`, `fixed`, `performance`, `architecture` y `source`. Conserva la fecha real y deja vacíos los apartados sin cambios demostrables. El panel se construye desde esa fuente; no necesitas duplicar componentes.

`src/data/engine.ts` concentra la información de juegos, tecnologías y roadmap observado. Registrar una novedad en el sitio no hace commit ni publica cambios del motor.

Antes de enviar una actualización, ejecuta las validaciones y revisa la página resultante en móvil y escritorio. La [auditoría](docs/ENGINE-AUDIT.md) explica la base de cada afirmación.

## Desplegar Hosting

Con Firebase CLI instalado y una sesión con acceso al proyecto:

```sh
firebase login
firebase projects:list
npm run build
firebase deploy --only hosting --project awesome-engine-web-arukado
```

Confirma el proyecto antes de ejecutar el despliegue. Este comando usa la configuración estática y mantiene el contacto desactivado. Para habilitar correo y conservarlo en CI, sigue [DEPLOYMENT.md](docs/DEPLOYMENT.md).

El workflow valida pull requests y pushes a `main`. Tras validar `main`, despliega Hosting usando el secreto de GitHub `FIREBASE_SERVICE_ACCOUNT_AWESOME_ENGINE`. Si falta, el despliegue falla con un mensaje explícito. Los pull requests del mismo repositorio pueden crear previews temporales; los forks ejecutan validación sin recibir credenciales. Las URLs de preview aparecen en el resumen de la ejecución.

## Configuración pendiente para enviar correo real

- Contraseña de aplicación de Gmail en el secreto `GMAIL_APP_PASSWORD`.
- Clave privada de Turnstile en `TURNSTILE_SECRET_KEY` y site key pública para el navegador.
- Parámetros `SMTP_USER` y `ALLOWED_ORIGINS` del backend.
- Backend desplegado y prueba de recepción en `carlosjcortinam@gmail.com`.
Blaze está activo por autorización del propietario. Firestore ya se creó con reglas privadas y TTL; aún no se ha desplegado la función de correo porque faltan secretos reales.

No pegues esas credenciales en código, incidencias, commits o archivos de ejemplo. La integración preparada no equivale a un envío confirmado.

## Licencias y recursos

El código original del sitio se publica bajo [MIT](LICENSE), copyright 2026 Carlos Cortina. Las dependencias, fuentes, capturas y recursos de terceros conservan sus licencias y atribuciones. La licencia del sitio no concede derechos adicionales sobre ellos; consulta [ASSETS.md](docs/ASSETS.md).

El repositorio excluye `.env` reales, secretos locales, credenciales, dependencias instaladas, cachés y artefactos generados. Los archivos `.env.example` contienen únicamente nombres y valores ilustrativos.