---
title: Recursos y persistencia
description: Carga de texturas, sonidos, fuentes y música; guardado JSON y capturas del motor.
order: 6
category: Sistemas
---

## Dónde busca los archivos

ResourceManager resuelve los nombres dentro de directorios concretos. Entrega un nombre de archivo relativo a la categoría correspondiente, no la ruta completa desde la raíz.

| API | Directorio | Resultado |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

Las rutas son relativas al directorio de trabajo de la aplicación. Por eso debes ejecutar desde la raíz del repositorio, donde existe `Content`.

## Cómo funciona la caché

Texturas, buffers de sonido y fuentes se guardan en mapas indexados por nombre de archivo. Una solicitud posterior consulta la entrada existente. La siguiente función procede del código de referencia:

```cpp
sf::Texture *ResourceManager::FetchTexture(const std::string &filename) {
  if (!textures_.contains(filename)) {
    if (!textures_[filename].loadFromFile("Content/Textures/" + filename)) {
      LOG_ERROR("Failed to load texture: {}", filename);
      return nullptr;
    }
  }

  return &textures_.at(filename);
}
```

El manager conserva la propiedad de esos objetos. Los consumidores no deben eliminar los punteros que reciben. Tampoco existe una operación pública de descarga, invalidación de caché o recarga automática.

Comprueba el resultado antes de usarlo. Texturas y fuentes insertan una entrada antes de cargar, por lo que un fallo puede requerir reiniciar para reintentar. `AcquireSound` inserta el buffer solo tras cargarlo y permite reintentar una carga fallida.

## Música y sonido

Los sonidos cortos utilizan `sf::SoundBuffer` cacheados. El juego crea y mantiene sus fuentes `sf::Sound` mientras usa esos buffers.

`FetchMusic` abre un archivo en un objeto `sf::Music` y lo devuelve dentro de un `optional`; si no puede abrirlo, devuelve `std::nullopt`. La música no se conserva en la caché de ResourceManager: la escena mantiene el objeto recibido y controla su reproducción.

No todas las cargas del proyecto pasan por el manager. El fondo de RenderManager, los shaders y ciertos recursos del núcleo se abren directamente desde sus clases.

## Guardado JSON

SaveManager lee `Content/Save.json` al construirse; si el archivo no existe, comienza con un objeto vacío. Su interfaz ofrece `Set`, `Get`, `Has`, `Erase` y `Clear`.

Al destruirse, escribe los valores si el objeto no está vacío. Esto sirve para persistir datos simples del juego, pero no es un sistema transaccional ni de guardado en la nube.

Dos límites que conviene conocer:

- Un JSON existente pero inválido no tiene recuperación general implementada.
- `Clear()` vacía los valores en memoria, pero el destructor no sobrescribe el archivo cuando el objeto queda vacío. No equivale necesariamente a borrar el guardado en disco.

Para probar cambios en persistencia, conserva una copia de tus datos antes de modificar el archivo.

## Capturas de pantalla

**F12** invoca `ScreenshotManager::Take`. El manager copia la ventana a una textura, obtiene la imagen y guarda un PNG en `Content/Screenshots`, creando el directorio si hace falta.

El nombre contiene la fecha y la hora con milisegundos. Se registra el resultado y se reproduce un sonido cuando se guarda correctamente. La aplicación necesita permisos de escritura en ese directorio.

## Fuentes

- [Carga y caché de recursos](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ResourceManager.cpp).
- [API de ResourceManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/ResourceManager.h).
- [Persistencia de SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp).
- [Capturas PNG](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ScreenshotManager.cpp).