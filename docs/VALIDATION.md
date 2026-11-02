# Registro de validación

Revisión independiente de contenido e infraestructura realizada el **1 de noviembre de 2026**, zona America/Bogota. Este registro separa las comprobaciones ejecutadas de las que requieren una build final, navegador o servicios externos.

## Contenido técnico

| Comprobación ejecutada | Resultado observado |
| --- | --- |
| Lectura del núcleo, managers, escenas, efectos, configuración y herramientas del motor | Arquitectura documentada contra `5a6dfacd86414c4cdfaa7157b533330f173a3126`. |
| Diferencia entre HEAD y árbol local | AudioGroup, SpriteAnimator, SweptAabb y refactorización de cooldown identificados como cambios locales, no releases. |
| Frontmatter de documentación | Nueve guías con `title`, `description`, `category` y órdenes numéricos únicos 1–9. |
| Referencias de código de las guías y auditoría | 35 destinos de permalinks comprobados contra objetos Git del SHA de referencia. Esta comprobación es local; no representa 35 peticiones HTTP. |
| Destinos entre guías Markdown | Todos los enlaces `/docs/<guía>/` examinados tienen un archivo correspondiente. |
| Historial de mejoras | Los 14 commits de `src/data/updates.ts` existen y sus fechas ISO coinciden exactamente con `%aI` de Git. |
| Descripciones de cambios relevantes | Se revisaron diffs de posprocesado, partículas, sincronización de pausa y límite de frames/sonido de Runner. No se atribuyen mejoras porcentuales sin mediciones. |
| Clasificación y límites en páginas | Se conserva el alcance 2D; no se anuncia ECS, editor, física general, multiplataforma certificada o releases inexistentes. |
| Búsqueda de guías e historial | La normalización de acentos convierte `Configuración` en `configuracion` con las expresiones usadas en ambas páginas. |

La revisión de juegos confirmó las afirmaciones de Plaguefront y su repositorio público `Arukado01/Plagefront`. La captura y el inventario final de medios se verifican por separado: este control no acredita la duración ni reproducción de videos que todavía estaban incorporándose.

## HTML estático disponible al revisar

Se recorrió el `dist` que existía antes de los dos ajustes de documentación indicados abajo. La inspección de HTML generado comprobó referencias locales de `href`, `src` y `poster`, fragmentos, IDs, títulos y metadatos:

- **17 páginas HTML**.
- **539 referencias locales y fragmentos**.
- **5 elementos de imagen** en esa build.
- Sin destinos ausentes ni fragmentos rotos detectados.
- Sin IDs duplicados detectados.
- Un `h1` por página, idioma español, título, descripción, canonical y Open Graph presentes.
- Los elementos de imagen examinados incluían atributo `alt`.

Estos resultados corresponden a aquella build. No sustituyen una revisión visual, un lector de pantalla ni el análisis de medios añadido posteriormente. Las referencias deben volver a comprobarse sobre el resultado final antes de publicar.

## Ajustes derivados de la revisión

1. La portada mostraba una fecha fija en las tarjetas de últimas novedades. Se cambió a una fecha derivada de `entry.date`, con zona America/Bogota y elemento semántico `time`.
2. El índice de contenido de las guías desaparecía en pantallas de hasta 1100 px. Se añadió un `details` dentro del artículo, con enlaces a sus encabezados de nivel dos, visible en ese intervalo. Conserva la navegación de escritorio.

Los cambios están limitados a `src/pages/index.astro` y `src/layouts/Docs.astro`.

## Configuración de infraestructura

| Comprobación ejecutada | Resultado observado |
| --- | --- |
| Sintaxis del workflow | YAML parseado sin errores; triggers PR, push a main y ejecución manual presentes. |
| Dependencias de acciones | Checkout, setup-node, upload-artifact, download-artifact y Firebase Hosting fijados a SHA de 40 caracteres, resueltos mediante GitHub API. |
| Versión de herramienta de despliegue | Firebase CLI 15.31.0 fijada en el workflow. |
| Configuración predeterminada | `firebase.json` contiene Hosting y emulador; no declara Functions ni Firestore. |
| Configuración opcional | `firebase.functions.json` apunta `/api/contact` a `contact` en `us-central1`, con runtime Node.js 22 y validación previa del backend. |
| Fallback estático de contacto | Rewrite a `/api/contact-unavailable.json`; el frontend exige HTTP correcto y `ok === true`. No se toma un HTTP 200 estático como envío. |
| Secretos de CI | El workflow exige `FIREBASE_SERVICE_ACCOUNT_AWESOME_ENGINE` y falla explícitamente si está ausente. No entrega el secreto al job de build. |
| Límites de previews | Solo PR del mismo repositorio y actor distinto de Dependabot; forks validan sin credenciales. No usa pull_request_target ni comentarios automáticos. |
| Reglas de datos | Firestore deniega lecturas y escrituras del cliente; el servidor se controla por IAM. |
| Expiración | Dos políticas TTL sobre `expiresAt`, en `contactLimits` y `contactRequests`. |
| Destino | Alias, sitio y workflow apuntan exclusivamente a `awesome-engine-web-arukado`. |

La existencia del workflow y del secreto no prueba que una ejecución remota haya terminado correctamente. El despliegue real, su URL y el resultado de GitHub Actions requieren evidencia adicional de la sesión de publicación.

## Diagnósticos de código durante la revisión

Se ejecutaron `npm run check` y `npm run lint` después de modificar la fecha y el índice móvil.

- El primer intento de Astro check no pudo escribir su caché `.astro` desde el sandbox. Se repitió con permisos para el proyecto independiente.
- Astro examinó 28 archivos y reportó siete errores TypeScript en callbacks `evaluate` de la nueva prueba `tests/e2e/site.spec.ts` al tratar elementos genéricos como imágenes o videos. No reportó errores en los dos archivos ajustados por esta revisión.
- ESLint reportó `no-control-regex` en `src/scripts/contact.ts`, por una expresión que valida caracteres de control.
- Ambos diagnósticos se entregaron para corrección. **Esta revisión no marca esos comandos como aprobados**; registrar abajo la repetición final tras corregirlos.

No se ejecutó correo real desde esta revisión. Las pruebas del backend con transporte controlado y los resultados de navegador deben registrarse por sus propias ejecuciones.

## Estado externo y comprobaciones pendientes

El proyecto Firebase, el repositorio público y la configuración del secreto de Hosting fueron confirmados durante la preparación. El intento registrado de vincular la cuenta de facturación terminó en `Precondition check failed`; no se considera activado Blaze por ese intento.

No presentar Functions, Turnstile o Gmail como operativos hasta contar con su configuración, despliegue y prueba de recepción. La alternativa estática conserva el formulario explícitamente inactivo.

Pendientes para completar con resultados efectivos:

- Repetición final de tipos, lint, pruebas y build tras las correcciones.
- Revisión visual y de teclado en móvil, tablet y escritorio.
- Temas claro, oscuro y sistema; persistencia y preferencia del dispositivo.
- Índice móvil y enlaces de las guías después de reconstruir.
- Galería, controles de video, error de carga y dimensiones de medios finales.
- Formulario inválido, indisponible, sin conexión y, cuando se habilite, envío real.
- Verificación HTTP de producción y página 404.
- Resultado del workflow remoto de main y, si se ejercita, preview de PR.

## Resultado final de navegador y publicación

Reservado para incorporar únicamente las comprobaciones realizadas sobre la build y publicación definitivas, con resultados, URL o identificador de ejecución y cualquier limitación restante.
## Validación final local

- 24/24 pruebas Playwright en Chrome aprobadas: todas las páginas, enlaces e imágenes; 320, 390, 768, 1440 y 1920 px; menú y teclado; tres temas y persistencia; búsquedas, filtros, estados vacíos y 404.
- Axe WCAG A/AA sin infracciones detectadas en las siete rutas representativas para temas claro y oscuro (control automatizado, no certificación formal).
- Los cuatro videos H.264 se reproducen en escritorio, 390 px y 768 px; galería con diálogo, navegación y recuperación del foco aprobada.
- 8 de las 24 pruebas usan respuestas controladas para el contacto: no acreditan entrega real por Gmail.
- Backend: 20/20 pruebas, TypeScript, ESLint y build aprobados. Frontend: 5 pruebas de contenido aprobadas, TypeScript y ESLint sin errores.
- npm audit: 0 vulnerabilidades en frontend y backend.
- Proyecto Firebase y repositorio público creados. Secreto de Hosting configurado directamente en GitHub Secrets sin escribir claves en archivos.
- Blaze confirmado activo después de configuración manual del propietario. Firestore creado en us-central1, reglas deny-all y TTL desplegados.
- El usuario eligió finalmente el logo A del sitio y pidió sustituir al finalizar únicamente el icono PNG del motor. El original está respaldado fuera de public.
- Pendientes: secretos Gmail/Turnstile y prueba de entrega real; ver CONTACT.md. Estado del pipeline y URL pública se registra después de su ejecución.

