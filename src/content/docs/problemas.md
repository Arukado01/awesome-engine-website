---
title: Solución de problemas
description: Diagnósticos concretos para compilación, recursos, controles, guardado y límites de la revisión auditada.
order: 9
category: Referencia
---

## CMake no configura el proyecto

Comprueba que estás en la raíz correcta y que `cmake --version` muestra 3.28 o posterior. Si elegiste `-G Ninja`, verifica que Ninja y el compilador estén disponibles en la terminal.

CMake utiliza FetchContent para descargar dependencias. Un error de conexión, proxy o Git puede detener esa fase antes de compilar el motor. Conserva el mensaje original para distinguir una descarga fallida de un error C++.

Si necesitas cambiar de generador o compilador, configura en un directorio nuevo; no reutilices una caché generada con herramientas diferentes.

## El compilador no encuentra funciones de C++20

El proyecto solicita C++20 y usa funciones de la biblioteca estándar como `std::format`. Seleccionar el estándar no añade funciones que falten en una biblioteca de compilador antigua. Revisa tanto la versión del compilador como su biblioteca estándar.

Las rutas de `.vscode` corresponden al equipo del autor. Una ruta inválida en esas opciones no significa que debas instalar las herramientas en esa misma ubicación.

## El ejecutable no encuentra Config.json o los recursos

Ejecuta desde la raíz, junto a `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

No cambies antes al directorio `Build`. La configuración, shaders, texturas, fuentes y sonidos usan rutas relativas. Revisa también que los nombres coincidan exactamente con los archivos de tu copia.

Un JSON inválido o una clave obligatoria ausente puede detener el arranque. Compara con el [archivo de referencia](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Content/Config.json) y conserva los tipos esperados.

## Fallos en sistemas sensibles a mayúsculas

La revisión auditada contiene diferencias entre rutas de Git y rutas usadas por el código. Por ejemplo, el árbol contiene `Engine/Include/utils` y varios includes usan `Utils`.

Windows puede tolerar estas diferencias en su configuración habitual. Otros sistemas pueden rechazarlas. La documentación no acredita compatibilidad Linux/macOS ni presenta su compilación como verificada.

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## El menú no muestra un juego

Comprueba que `games` tenga al menos una entrada en `Content/Config.json` y que `name` coincida con la clave exacta de `SceneFactory`. Reinicia el motor después de guardar.

## El juego se pausa al cambiar de ventana

Es comportamiento definido: Engine responde a la pérdida de foco pausando la escena. El bucle deja de renderizar mientras no tiene foco y mantiene el reloj actualizado. Si al volver sigue visible el overlay, utiliza Resume o Escape.

El reloj de juego y los cooldowns vinculados se detienen durante la pausa; el reloj real sigue avanzando. Un `Cooldown` independiente usa tiempo real.

## No aparecen los efectos o cambia su aspecto al redimensionar

La cadena se configura solo si `sf::Shader::isAvailable()` es verdadero. Cuando se crea, Bloom y Monitor están activos; Glitch e inversión no están conectados al flujo normal.

Al redimensionar, el motor ajusta las texturas principales y conserva las proporciones del área de juego. Las texturas internas de Bloom se dimensionan al crear el efecto, a partir del tamaño de diseño.

## Un mando responde de forma inesperada

El mapeo de botones distingue vendor Microsoft y utiliza una tabla alternativa para los demás mandos. Revisa `InputBindings.cpp` y la identificación que proporciona SFML. No se encontró una base de datos universal de controles ni remapeo persistente en una interfaz.

## El guardado no se borra al llamar Clear

SaveManager vacía los datos en memoria, pero solo escribe al destruirse si conserva valores. Por tanto, `Clear` no elimina necesariamente el archivo anterior. Antes de probar cambios, guarda una copia de `Content/Save.json` y verifica su contenido con la aplicación cerrada.

Un archivo de guardado con JSON inválido tampoco tiene recuperación general implementada.

## No se guarda una captura

F12 guarda dentro de `Content/Screenshots`. Comprueba permisos de escritura y espacio disponible. ScreenshotManager registra si pudo guardar la imagen; el sonido de captura se reproduce únicamente cuando la operación de guardado devuelve éxito.

## Comunicar un problema reproducible

Al abrir una incidencia en el [repositorio](https://github.com/Arukado01/AwesomeEngine), incluye el commit utilizado, sistema operativo, compilador, comando ejecutado, directorio de trabajo, mensaje de error y pasos para reproducirlo. Indica si tu copia tiene cambios locales: permite distinguir el código publicado de trabajo todavía en desarrollo.

## Fuentes

- [Configuración de compilación](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/CMakeLists.txt).
- [Comportamiento de Engine](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Core/Engine.cpp).
- [Registro real de escenas](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Scene/SceneFactory.cpp).
- [Persistencia de SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Managers/SaveManager.cpp).