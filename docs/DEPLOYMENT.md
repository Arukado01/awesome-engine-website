# Despliegue y operación

Este documento distingue **Hosting estático**, **credenciales de CI** y **backend de correo**. Publicar el sitio no habilita automáticamente el envío de mensajes.

## Destinos

| Recurso | Valor |
| --- | --- |
| Proyecto Firebase | `awesome-engine-web-arukado` |
| Sitio Hosting | `awesome-engine-web-arukado` |
| Producción | https://awesome-engine-web-arukado.web.app |
| Repositorio web | https://github.com/Arukado01/awesome-engine-website |
| Región de contacto | `us-central1` |
| Función | `contact` |
| Destinatario fijo | `carlosjcortinam@gmail.com` |

El alias local está en `.firebaserc`. Los comandos incluyen `--project` para que una selección previa de otro proyecto no cambie el destino. El motor C++ tiene su propio repositorio y no participa en el despliegue web.

## 1. Preparación y validación

Usa Node.js 22.23.4 o posterior de la rama 22 y Firebase CLI 15.31.0, la versión fijada en CI.

```sh
npm ci
npm --prefix functions ci
npm run check
npm run lint
npm test
npm run build
npm --prefix functions run check
firebase --version
firebase login:list
firebase projects:list
```

Si no existe sesión, ejecuta `firebase login`. No confundas una compilación correcta con una publicación: el despliegue debe terminar correctamente y la URL debe responder.

## 2. Publicar solo el sitio

`firebase.json` contiene exclusivamente Hosting y el emulador estático. Su directorio público es `dist`; sirve la página 404 real, sin un rewrite global a la portada. Incluye cabeceras de seguridad y caché prolongada para los assets con hash de Astro.

```sh
firebase deploy --only hosting --project awesome-engine-web-arukado
```

El endpoint `/api/contact` se redirige internamente al JSON de indisponibilidad. Hosting estático puede responder HTTP 200 al servir ese archivo; **el cuerpo contiene `ok: false`** y nunca constituye un envío. El frontend exige una respuesta HTTP correcta y `ok === true`, y mantiene el formulario desactivado por defecto.

No se impone una redirección global de barra final: podría alterar un POST a `/api/contact`. Las páginas de Astro ya se generan como directorios con su URL correspondiente.

Comprueba inicio, documentación, contacto, una ruta inexistente y cambio de tema tras publicar. Conserva la salida del despliegue y el commit publicado como evidencia operativa.

## 3. Credencial de GitHub Actions

El workflow `.github/workflows/ci-deploy.yml` usa acciones oficiales fijadas a SHA y Firebase CLI 15.31.0. La credencial no se entrega a los pasos de instalación, pruebas o compilación; solo a los pasos de despliegue.

Crea una cuenta de servicio exclusiva de este proyecto para Hosting. Para el sitio estático, utiliza los permisos específicos de **Firebase Hosting Admin** (`roles/firebasehosting.admin`) y **API Keys Viewer** (`roles/serviceusage.apiKeysViewer`). No utilices Owner o Editor. Si se activa el rewrite a Functions, la herramienta de Hosting también puede necesitar **Cloud Run Viewer** (`roles/run.viewer`). Firebase Authentication Admin se necesita cuando una integración modifica dominios de Firebase Auth; este sitio no incorpora Firebase Auth.

La [guía oficial de la acción](https://github.com/FirebaseExtended/action-hosting-deploy/blob/500ac625ca2dd40cbd15f7659af953801858032a/docs/service-account.md) explica los permisos y la credencial JSON. Revisa la necesidad concreta de cada rol y limita su alcance al proyecto indicado.

En GitHub, abre **Settings → Secrets and variables → Actions → New repository secret**:

```text
FIREBASE_SERVICE_ACCOUNT_AWESOME_ENGINE
```

Guarda allí el JSON de la cuenta de servicio. No lo copies al repositorio ni a la documentación. El workflow falla con un mensaje claro si falta el secreto; no marca un despliegue omitido como exitoso.

### Qué ejecuta el pipeline

- Pull request a `main`: instala con `npm ci`, valida tipos, lint, pruebas y build del frontend; instala y ejecuta el `check` completo del backend; instala Chromium y ejecuta `npm run test:e2e` con Playwright y axe.
- Push a `main`: ejecuta las mismas validaciones, conserva `dist` como artefacto y despliega el canal `live`.
- Pull request del mismo repositorio: después de validar, despliega el artefacto a `pr-<número>` durante siete días.
- Pull requests de forks y Dependabot: validación sin credenciales ni despliegue de preview.
- Ejecución manual: permite repetir la validación; producción solo se despliega desde `main`.

Las pruebas de navegador fuerzan `PUBLIC_CONTACT_ENABLED=false` y una site key vacía únicamente en su paso, sin alterar el artefacto de producción ya construido. Si fallan, los diagnósticos disponibles se adjuntan durante siete días. Las previews no habilitan contacto y publican su URL en el resumen de Actions, sin comentarios automáticos en PR. No se utiliza `pull_request_target`. El permiso de GitHub es de lectura; no se solicita escritura de contenido ni de pull requests.

## 4. Activar el backend de contacto

**No ejecutes esta sección hasta contar con autorización para cualquier cambio de facturación.** Cloud Functions requiere Blaze para desplegar; el backend también utiliza Firestore, Secret Manager y eliminación TTL, que pueden generar consumo facturable. La alternativa ya preparada es mantener Hosting estático y el contacto explícitamente inactivo. No existe un envío ficticio o mailto como sustituto.

Consulta el [requisito de despliegue de Functions](https://firebase.google.com/docs/functions/get-started) y las condiciones de tu proyecto antes de cambiar el plan. Ni el workflow ni el comando de Hosting anterior activan el backend.

### Credenciales y parámetros exactos

| Nombre | Almacenamiento | Uso |
| --- | --- | --- |
| `GMAIL_APP_PASSWORD` | Firebase Secret Manager | Contraseña de aplicación de la cuenta SMTP. |
| `TURNSTILE_SECRET_KEY` | Firebase Secret Manager | Validación del token en el servidor. |
| `SMTP_USER` | `functions/.env.awesome-engine-web-arukado` | Cuenta Gmail remitente; predeterminado `carlosjcortinam@gmail.com`. |
| `ALLOWED_ORIGINS` | Mismo archivo de parámetros | Orígenes exactos separados por comas. |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable pública de build | Widget del navegador; no es la clave secreta. |
| `PUBLIC_CONTACT_ENABLED` | Variable pública de build | Activación explícita de la interfaz; inicialmente `false`. |
| `PUBLIC_CONTACT_ENDPOINT` | Variable pública de build | `/api/contact`. |

Gmail exige una cuenta apta para [contraseñas de aplicación y verificación en dos pasos](https://support.google.com/accounts/answer/185833). No uses la contraseña habitual de Google. Algunas configuraciones de cuenta no permiten crear contraseñas de aplicación; en ese caso debe elegirse otra integración autorizada antes de afirmar que el envío funciona.

Crea un widget de [Turnstile](https://developers.cloudflare.com/turnstile/get-started/) autorizado para los dominios de producción. La site key se publica; la secret key permanece en el servidor. Las claves de prueba no acreditan protección real en producción.

Después de autorizar los servicios requeridos, establece los secretos de forma interactiva, sin valores en argumentos o historial de comandos:

```sh
firebase functions:secrets:set GMAIL_APP_PASSWORD --project awesome-engine-web-arukado
firebase functions:secrets:set TURNSTILE_SECRET_KEY --project awesome-engine-web-arukado
```

Copia `functions/.env.example` a `functions/.env.awesome-engine-web-arukado` y configura únicamente los parámetros no secretos:

```dotenv
SMTP_USER=carlosjcortinam@gmail.com
ALLOWED_ORIGINS=https://awesome-engine-web-arukado.web.app,https://awesome-engine-web-arukado.firebaseapp.com,https://awesomeengine.tech
```

Las variables de entorno reales están excluidas de Git. Los secretos se vinculan expresamente a la función; véase [Secret Manager para Functions](https://firebase.google.com/docs/functions/config-env).

### Firestore y funciones

Prepara una base Firestore `(default)` en el proyecto autorizado. `firestore.rules` deniega todas las lecturas y escrituras desde clientes. El Admin SDK del servidor usa IAM; nunca distribuyas sus credenciales al navegador.

Las colecciones `contactLimits` y `contactRequests` contienen metadatos de control de abuso e idempotencia. `firestore.indexes.json` configura TTL en `expiresAt` y desactiva índices innecesarios de ese campo. TTL es asíncrono, no una garantía de borrado inmediato; no se usa como única decisión del límite de uso. Consulta la [referencia de índices y TTL](https://firebase.google.com/docs/reference/firestore/indexes).

Con las credenciales y servicios preparados:

```sh
npm --prefix functions run check
firebase deploy --config firebase.functions.json --only firestore:rules,firestore:indexes,functions --project awesome-engine-web-arukado
```

La configuración alternativa incluye `contact` en `us-central1`, runtime Node.js 22, build de backend previo y rewrite de Hosting a esa función. No se ejecuta desde CI automáticamente.

### Habilitar la interfaz y mantener el rewrite en CI

Primero prueba la función desplegada con Turnstile real y confirma recepción en Gmail. Una aceptación SMTP es evidencia de aceptación por el servicio, no garantía de colocación en la bandeja principal.

Cuando el backend esté operativo, configura estas **variables de repositorio** de GitHub:

```text
CONTACT_BACKEND_DEPLOYED=true
PUBLIC_TURNSTILE_SITE_KEY=<site key pública real>
```

El workflow activa `PUBLIC_CONTACT_ENABLED` solo para la build de `main` y sustituye la configuración de Hosting por `firebase.functions.json` durante ese job. Sigue desplegando únicamente Hosting; no modifica funciones, secretos, Firestore o facturación. Las previews mantienen la configuración estática y el contacto desactivado.

Para desplegar manualmente la interfaz habilitada, establece en tu `.env` local `PUBLIC_CONTACT_ENABLED=true`, la site key pública y `/api/contact`, vuelve a construir y utiliza:

```sh
npm run build
firebase deploy --config firebase.functions.json --only hosting --project awesome-engine-web-arukado
```

No uses el comando estático por defecto para una interfaz habilitada: volvería a servir la respuesta de indisponibilidad.

## 5. Comprobar un envío de extremo a extremo

Desde la URL de producción, completa todos los campos, resuelve Turnstile y envía un mensaje de prueba identificado como tal. Confirma su recepción en `carlosjcortinam@gmail.com`, incluido remitente, asunto, mensaje y fecha. Verifica también datos inválidos, token ausente o caducado, origen no autorizado, fallo de conexión y reintento con el mismo identificador.

No declares el correo operativo solo por una prueba unitaria, una build correcta o un mensaje de éxito en el navegador. Las pruebas automatizadas del backend usan un transporte controlado y no envían correos reales.

## 6. Emulación y recuperación

Para comprobar Hosting sin nube:

```sh
npm run build
firebase emulators:start --only hosting --project demo-awesome-engine
```

Para la integración local del backend, usa `firebase.functions.json`, parámetros locales y los ejemplos de secretos del backend. Un entorno de emulación con credenciales SMTP reales puede enviar correo real: utiliza los tests automatizados para validar transporte sin mensajes externos. No copies secretos reales a ejemplos.

Una publicación estática anterior puede restaurarse desde el historial de releases de Hosting. Para desactivar contacto de forma controlada, elimina o cambia a `false` `CONTACT_BACKEND_DEPLOYED`, reconstruye y publica `main`; revisa aparte si necesitas deshabilitar la función o revocar sus secretos. El workflow no elimina recursos de backend al desactivar la interfaz.