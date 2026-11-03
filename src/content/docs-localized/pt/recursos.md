---
title: Recursos e persistência
description: Carregamento de texturas, sons, fontes e música; salvamento em JSON e capturas do motor.
order: 6
category: Sistemas
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## Onde os arquivos são procurados

O ResourceManager resolve nomes dentro de diretórios específicos. Forneça um nome de arquivo relativo à categoria correspondente, não o caminho completo a partir da raiz.

| API | Diretório | Resultado |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

Os caminhos são relativos ao diretório de trabalho do aplicativo. Por isso, você deve executar a partir da raiz do repositório, onde existe `Content`.

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## Como o cache funciona

Texturas, buffers de som e fontes são armazenados em mapas indexados pelo nome do arquivo. Uma solicitação posterior consulta a entrada existente. A função abaixo vem do código de referência:

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

O manager mantém a propriedade desses objetos. Os consumidores não devem excluir os ponteiros que recebem. Também não existe uma operação pública para descarregar recursos, invalidar o cache ou recarregar automaticamente.

Verifique o resultado antes de usar. Texturas e fontes inserem uma entrada antes da carga, portanto uma falha pode exigir reinício para tentar novamente. `AcquireSound` insere o buffer somente após o carregamento e permite nova tentativa.

<span id="música-y-sonido" aria-hidden="true"></span>

## Música e som

Sons curtos usam objetos `sf::SoundBuffer` em cache. O jogo cria e mantém suas fontes `sf::Sound` enquanto usa esses buffers.

`FetchMusic` abre um arquivo em um objeto `sf::Music` e o retorna dentro de um `optional`; se não conseguir abrir, retorna `std::nullopt`. A música não é mantida no cache do ResourceManager: a cena mantém o objeto recebido e controla sua reprodução.

Nem todos os carregamentos do projeto passam pelo manager. O fundo do RenderManager, os shaders e determinados recursos do núcleo são abertos diretamente por suas classes.

<span id="guardado-json" aria-hidden="true"></span>

## Salvamento em JSON

O SaveManager lê `Content/Save.json` ao ser construído; se o arquivo não existir, começa com um objeto vazio. Sua interface oferece `Set`, `Get`, `Has`, `Erase` e `Clear`.

Ao ser destruído, grava os valores se o objeto não estiver vazio. Isso permite persistir dados simples do jogo, mas não é um sistema transacional nem de salvamento na nuvem.

Duas limitações que vale conhecer:

- Um JSON existente, mas inválido, não tem recuperação geral implementada.
- `Clear()` esvazia os valores na memória, mas o destrutor não sobrescreve o arquivo quando o objeto fica vazio. Isso não equivale necessariamente a apagar os dados salvos em disco.

Para testar alterações na persistência, mantenha uma cópia dos seus dados antes de modificar o arquivo.

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## Capturas de tela

**F12** chama `ScreenshotManager::Take`. O manager copia a janela para uma textura, obtém a imagem e salva um PNG em `Content/Screenshots`, criando o diretório se necessário.

O nome contém a data e a hora com milissegundos. O resultado é registrado, e um som é reproduzido quando o salvamento é concluído com sucesso. O aplicativo precisa de permissão de escrita nesse diretório.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Carregamento e cache de recursos](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ResourceManager.cpp).
- [API do ResourceManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/ResourceManager.h).
- [Persistência do SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp).
- [Capturas PNG](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ScreenshotManager.cpp).
