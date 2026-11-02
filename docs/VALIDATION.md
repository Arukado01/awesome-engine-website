# Validación y estado de entrega

El sitio es independiente del motor. La referencia técnica auditada es `5a6dfacd86414c4cdfaa7157b533330f173a3126`; los cambios locales se etiquetan por separado.

## Comprobaciones aprobadas

| Área                       | Evidencia                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contenido                  | Nueve guías, 35 referencias de código comprobadas contra objetos Git, 14 commits y fechas de historial auténticos.                                                |
| Frontend                   | TypeScript, ESLint, cinco pruebas de contenido y build de 17 páginas aprobados.                                                                                   |
| Backend                    | TypeScript, ESLint, 20 pruebas y build aprobados. Las pruebas usan SMTP y CAPTCHA controlados, sin envío real.                                                    |
| Navegador                  | 26 casos Playwright verificados en Chrome local. GitHub Actions ejecuta la suite completa en Chromium para cada revisión.                                         |
| Responsive                 | Sin desbordamiento horizontal a 320, 390, 768, 1440 y 1920 px en las rutas representativas.                                                                       |
| Interacciones              | Menú móvil, teclado, filtros, búsquedas, estados vacíos, 404, temas claro/oscuro/sistema y persistencia.                                                          |
| Accesibilidad              | Axe con WCAG 2 A/AA y 2.1 A/AA, siete rutas en claro y oscuro, sin infracciones detectadas. No equivale a una certificación de accesibilidad.                     |
| Contacto                   | Ocho pruebas de navegador con respuestas controladas verifican validación, éxito condicionado, error, timeout, CAPTCHA e idempotencia.                            |
| Medios                     | Diez capturas PNG y cuatro videos H.264; ffprobe y decodificación completa sin errores. Reproducción en escritorio, 390 px y 768 px; galerías con foco y teclado. |
| Dependencias               | npm audit sin vulnerabilidades conocidas en frontend y backend durante la entrega.                                                                                |
| Privacidad del repositorio | Sin secretos, credenciales, .env reales, ejecutables del motor ni originales privados de grabación versionados.                                                   |

Se corrigieron los diagnósticos encontrados: tipado de callbacks de pruebas, expresión de validación, fecha dinámica del historial, índice móvil de guías, distinción visual de enlaces y nombre accesible de la marca. La suite no omite esos controles para obtener un resultado favorable.

## Rendimiento

Lighthouse tras incorporar el selector y las animaciones, sobre la build de producción servida localmente con emulación móvil: **rendimiento 99, accesibilidad 100, buenas prácticas 100 y SEO 100**. El informe completo se conserva fuera de los archivos públicos en `.capture-work/qa/lighthouse-final-motion.report.html` y `.json`. Son mediciones de laboratorio de una ejecución; el rendimiento real depende del dispositivo y la conexión.

Las imágenes tienen dimensiones explícitas, el hero usa WebP, las fuentes se sirven localmente y los videos usan `preload="none"`, miniaturas y H.264 con `faststart`.

## Publicación verificada

- Proyecto Firebase: `awesome-engine-web-arukado`.
- Sitio: https://awesome-engine-web-arukado.web.app/.
- Repositorio público: https://github.com/Arukado01/awesome-engine-website.
- Primera ejecución completa de CI/CD: [41390719299](https://github.com/Arukado01/awesome-engine-website/actions/runs/41390719299), commit `1390f5f359becc4410e52c169c98a9d376e935b3`: validación y despliegue Hosting aprobados.
- El secreto de Hosting se transfirió directamente a GitHub Secrets; no se escribió una clave privada en disco.
- Blaze confirmado activo después de la configuración manual del propietario. Firestore creado en `us-central1` con reglas que deniegan todo acceso cliente y políticas TTL para los registros del contacto.
- La preview de PR se comprueba con la revisión de accesibilidad y documentación que acompaña este informe. El resultado queda en las ejecuciones de Actions.

## Límites pendientes

El correo **no está habilitado**: faltan `GMAIL_APP_PASSWORD`, `TURNSTILE_SECRET_KEY` y `PUBLIC_TURNSTILE_SITE_KEY`, además del despliegue de `contact` y la confirmación de recepción real en Gmail. Firestore y los parámetros no secretos ya están preparados. Ver [CONTACT.md](CONTACT.md) y [DEPLOYMENT.md](DEPLOYMENT.md).

No se anuncian estas pruebas como un envío real. La interfaz pública informa de la indisponibilidad y no permite simular éxito.

Los videos no contienen audio: el entorno no expuso un dispositivo de captura de audio. Mantienen las dimensiones nativas, 800 × 800 en Runner y 1440 × 900 en Plaguefront. Procedencia y límites: [CAPTURE.md](CAPTURE.md).

El usuario eligió el logo A del sitio y autorizó sustituir al finalizar únicamente `Content/Textures/icon.png` del motor por su PNG transparente. El icono anterior se respalda en `.capture-work/originals/engine-icon-original.png`. No se modifican lógica, configuración ni cambios locales previos de los videojuegos.

La primera prueba de PR detectó un runner con Node 22.23.3, inferior al mínimo real de Astro. Se corrigió fijando Node 22.23.4 en .nvmrc y haciendo que todos los jobs lean ese archivo; esa es la versión que aprobó el primer despliegue. No se redujo la versión mínima ni se omitió TypeScript.

La comprobación de rutas se contrastó con git ls-tree: el icono está versionado como Content/Textures/Icon.png; la discrepancia real de mayúsculas está en Engine/Include/utils frente a los includes Utils. La documentación no atribuye al icono un problema de portabilidad inexistente en Git.

Las pruebas de navegador ahora construyen y sirven una copia estática aislada en .e2e-dist. Esto elimina recargas HMR durante la inspección de páginas y mantiene dist intacto para el despliegue. La suite actual contiene 26 casos, incluidos el control por teclado del selector y la cancelación de animaciones al activar movimiento reducido.

La preview de la PR 1 se desplegó correctamente en la ejecución 41391530941. Se añade verificación posterior sobre la URL real en un job independiente sin credenciales de despliegue, aplicable tanto a main como a previews. No se confunde la suite local con esta verificación remota.

El selector de tema utiliza un panel con iconos y radios nativos, conserva la preferencia y permite cierre por Escape y clic fuera. Se revisó visualmente en claro, oscuro y 320 px. Las entradas escalonadas se reproducen una vez al aparecer cada sección; las secuencias decorativas duran menos de cinco segundos y no cambian las capturas ni la velocidad de los videos. El contenido permanece visible sin JavaScript.
