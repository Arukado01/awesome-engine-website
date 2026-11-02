# Contacto con Gmail SMTP

El endpoint `contact` usa Firebase Functions v2, Node.js 22, Nodemailer y **Gmail SMTP sobre TLS**. Tanto el remitente predeterminado como el destinatario fijo son `carlosjcortinam@gmail.com`; el correo del visitante se utiliza únicamente como `Reply-To`. No usa `mailto:` ni muestra éxito antes de que Gmail acepte el mensaje.

## Estado y requisitos pendientes

El código, pruebas y configuración están preparados. **El envío real permanece deshabilitado hasta configurar los secretos y desplegar el backend.** No se ha enviado correo de prueba desde esta implementación. Blaze está activo y Firestore ya tiene reglas privadas y TTL desplegados. Falta aportar los secretos reales, desplegar la función y comprobar la recepción en Gmail.

Requisitos:

1. Firebase Blaze en el proyecto exclusivo del sitio. Cloud Functions requiere este plan. Hosting estático puede desplegarse de forma independiente. No usar ni alterar otro proyecto.
2. Una **contraseña de aplicación de Google** para la cuenta `carlosjcortinam@gmail.com`, guardada como `GMAIL_APP_PASSWORD` en Secret Manager. No utilizar la contraseña normal de Gmail. Las contraseñas de aplicación requieren verificación en dos pasos y pueden no estar disponibles bajo determinadas políticas de cuenta.
3. Widget Turnstile configurado para los dominios del sitio, `PUBLIC_TURNSTILE_SITE_KEY` pública para el frontend y `TURNSTILE_SECRET_KEY` privada. El widget debe usar `action: 'contact'`.
4. Firestore en el proyecto dedicado. Las colecciones `contactLimits` y `contactRequests` deben denegar cualquier acceso desde el cliente; Functions usa Firebase Admin mediante IAM.
5. `ALLOWED_ORIGINS` con los orígenes exactos, sin barra final. `SMTP_USER` vale `carlosjcortinam@gmail.com` por defecto y debe corresponder a la cuenta de la contraseña de aplicación.

La aceptación SMTP no garantiza llegada a la bandeja de entrada: confirmar recepción real en Gmail, incluida la carpeta de spam. Gmail aplica límites y controles de seguridad propios; los límites locales no los sustituyen. Si el volumen creciera, evaluar un proveedor transaccional como una decisión futura; no hay integración activa con Resend.

## Secretos y parámetros

Desde la raíz del sitio, establecer los secretos mediante prompts interactivos:

```sh
firebase functions:secrets:set GMAIL_APP_PASSWORD --project awesome-engine-web-arukado
firebase functions:secrets:set TURNSTILE_SECRET_KEY --project awesome-engine-web-arukado
```

Nunca escribir valores secretos en comandos, GitHub, YAML, frontend o archivos versionados. No crear valores ficticios para conseguir que el despliegue pase.

Copiar `functions/.env.example` a `functions/.env.awesome-engine-web-arukado` y configurar los parámetros no secretos:

```dotenv
SMTP_USER=carlosjcortinam@gmail.com
ALLOWED_ORIGINS=https://awesome-engine-web-arukado.web.app,https://awesome-engine-web-arukado.firebaseapp.com
```

Los archivos reales `.env.*` y `.secret.local` deben estar ignorados por Git. La clave pública `PUBLIC_TURNSTILE_SITE_KEY` pertenece al entorno de compilación del frontend. La CSP debe permitir `https://challenges.cloudflare.com` para scripts, frames y conexiones del widget.

El sitio estático se despliega con `firebase.json`. La configuración opcional `firebase.functions.json` añade backend y reescritura `/api/contact` hacia `contact` en `us-central1`. No usar esa configuración hasta que existan ambos secretos reales y Firestore esté listo.

## Contrato HTTP

`POST /api/contact` con `Content-Type: application/json`, hasta 16 KiB:

```json
{
  "name": "Nombre del visitante",
  "email": "visitor@example.com",
  "subject": "Consulta sobre Awesome Engine",
  "message": "Mensaje de al menos veinte caracteres.",
  "website": "",
  "turnstileToken": "token-efimero-del-widget",
  "requestId": "a987fbc9-4bed-4078-8f07-9141ba07c9f3"
}
```

- Nombre: 2–80 caracteres; asunto: 3–160; mensaje: 20–5000; correo válido de hasta 254 caracteres. Se rechazan caracteres de control e inyección de cabeceras.
- `website` es el honeypot; mantenerlo vacío y oculto a tecnologías de asistencia, con `tabindex=-1` y sin autocompletado.
- Crear `requestId` con `crypto.randomUUID()`. Mantenerlo para reintentos del mismo contenido. Si el contenido cambia, iniciar otro identificador.
- Turnstile usa tokens de un solo uso. Resetear el widget después de cada respuesta/error y obtener otro token antes de reintentar.
- Las respuestas de aplicación son JSON `{ "ok": boolean, "message": string, "errors"?: { "campo": "explicación" }, "code"?: string }`. `code=delivery_uncertain` exige conservar el ID y advertir que iniciar otro intento puede duplicar el mensaje; `smtp_rejected` permite reintentar, y `request_in_progress` indica esperar.

| HTTP | Significado |
| --- | --- |
| 201 | Gmail aceptó el mensaje, o este intento ya estaba confirmado. |
| 400 | Validación; `errors` identifica los campos. |
| 403 | Origen, honeypot o Turnstile inválidos. |
| 405 / 415 / 413 | Método, tipo o tamaño no permitidos. |
| 409 | Intento en curso, contenido distinto para un mismo ID o resultado SMTP incierto. |
| 429 | Límite alcanzado; respetar `Retry-After`. |
| 502 | Gmail rechazó el envío o no se pudo confirmar su resultado. Mostrar el mensaje exacto. |
| 503 | Configuración pendiente o servicio temporalmente no disponible. |

El frontend debe tolerar respuestas de infraestructura no JSON, conservar los campos ante errores y no mostrar éxito por un fallo de red. No reintentar automáticamente ni generar un ID nuevo después de un resultado incierto. La interfaz conserva los campos en modo de solo lectura: ante un fallo de red permite comprobar el mismo ID con un token nuevo; ante `delivery_uncertain` impide reenviarlo. La acción «Iniciar otro envío» requiere una confirmación explícita del visitante sobre el riesgo de duplicar el correo y entonces genera otro ID.

## Protección contra abuso y duplicados

- Validación en servidor, orígenes exactos, honeypot, CAPTCHA con comprobación de `success`, `hostname` y `action`, y límite de cuerpo.
- Firestore aplica mediante transacciones 5 intentos/hora por IP y 200 intentos/día globales, en ventanas fijas UTC. CAPTCHA inválido también consume cuota. No son límites deslizantes.
- No se persiste la IP: su identificador es un HMAC SHA-256 rotado cada hora. La clave HMAC es el secreto Turnstile. Los hashes siguen siendo metadatos de seguridad y requieren retención limitada.
- `contactLimits` guarda contadores y `expiresAt` a dos días. `contactRequests` guarda UUID, HMAC del contenido, estado, fecha, bloqueo de 60 segundos y `expiresAt` a siete días. No guarda nombre, correo ni mensaje.
- Gmail SMTP no ofrece una clave de idempotencia. Una reserva transaccional evita dos envíos simultáneos del mismo intento. Un envío confirmado nunca se repite. Un fallo explícito de autenticación o rechazo del envelope SMTP permite reintentar. Una desconexión/timeout después de `DATA` puede haber entregado el correo: se conserva como **incierto** y no se reenvía.
- Si una función termina antes de persistir el resultado, su reserva pendiente vencida también se trata como incierta. Esto prioriza evitar duplicados y puede requerir comprobación manual del correo enviado.
- No se registran mensajes, IP ni secretos en logs de aplicación. Revisar además los logs de petición y retención de las plataformas.
- TLS en `smtp.gmail.com:465`, certificados verificados; sin acceso de Nodemailer a archivos/URLs y sin logging SMTP. El visitante no puede cambiar destinatario, SMTP host ni credenciales.
- Límite de 2 instancias, concurrencia 10, 256 MiB, timeout 30 segundos y cero instancias mínimas. Turnstile tiene timeout de 8 segundos; SMTP usa límites de conexión/saludo/inactividad. Una interrupción de la función conserva una reserva que no se reenvía automáticamente.

Configurar TTL para `expiresAt` en ambas colecciones o eliminar periódicamente los registros vencidos. Un campo `expiresAt` por sí solo **no elimina** documentos. TTL es asíncrono y puede generar operaciones facturadas; aplicarlo bajo la autorización del plan. Las ventanas de cuota y bloqueos no dependen de que TTL haya borrado documentos.

El visitante transmite datos a Google/Gmail para correo y a Cloudflare para antispam; incluirlo en el aviso de privacidad. Configurar presupuestos/alertas y revisar IAM: un presupuesto no detiene por sí mismo toda facturación.

Reglas mínimas de Firestore:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
  }
}
```

## Pruebas y emuladores

```sh
npm ci --prefix functions
npm run check --prefix functions
```

`check` ejecuta TypeScript, ESLint, pruebas y compilación. Las pruebas usan adaptadores controlados: verifican validación, antispam, cuotas, rechazo, aceptación SMTP y ausencia de reenvíos ambiguos, sin enviar correos ni necesitar credenciales. No sustituyen una prueba real de Gmail/Firestore en producción.

Para emuladores, instalar Java compatible con Firebase Emulator Suite. Copiar los ejemplos privados a `functions/.env.local` y `functions/.secret.local`, configurar `ALLOWED_ORIGINS=http://localhost:4321` y un widget Turnstile de desarrollo permitido en localhost. No rebajar las verificaciones de hostname/action para aceptar tokens ficticios.

```sh
npm run build --prefix functions
firebase emulators:start --config firebase.functions.json --only functions,firestore --project demo-awesome-engine
```

Endpoint local: `http://127.0.0.1:5001/demo-awesome-engine/us-central1/contact`. El prefijo `demo-` evita usar por accidente servicios Firebase reales, pero SMTP/Turnstile siguen siendo externos si se aportan credenciales reales. Las pruebas unitarias no hacen estas llamadas.

Se fijan transitoriamente `glob` 14.0.3 y `minimatch` 11.0.3 mediante `overrides` para corregir vulnerabilidades transitivas en Google Cloud y las herramientas de lint. Revisar los overrides al actualizar dependencias y conservar el lockfile.

## Activación y verificación final

Una vez configurados secretos, Firestore y entorno:

```sh
npm run check --prefix functions
firebase deploy --config firebase.functions.json --only firestore:rules,functions:contact --project awesome-engine-web-arukado
# Habilitar el frontend con su site key y endpoint, compilar y desplegar Hosting con la configuración de Functions.
```

Enviar una sola prueba identificada desde el formulario público. Comprobar `201` y recepción real en `carlosjcortinam@gmail.com`, remitente, Reply-To, asunto, mensaje y fecha. Verificar campos inválidos, CAPTCHA vencido y error de red. No marcar el correo como operativo hasta completar esa prueba.

## Referencias oficiales

- [Firebase: requisito Blaze](https://firebase.google.com/docs/functions/get-started)
- [Firebase: parámetros y secretos](https://firebase.google.com/docs/functions/config-env)
- [Google: contraseñas de aplicación](https://support.google.com/accounts/answer/185833)
- [Nodemailer: Gmail](https://nodemailer.com/guides/using-gmail)
- [Nodemailer: errores SMTP](https://nodemailer.com/errors)
- [Cloudflare: validación Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
