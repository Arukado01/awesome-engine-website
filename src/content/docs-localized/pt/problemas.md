---
title: Solução de problemas
description: Diagnósticos práticos para compilação, recursos, controles, salvamento e limites da revisão auditada.
order: 9
category: Referência
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## O CMake não configura o projeto

Verifique se você está na raiz correta e se `cmake --version` mostra 3.28 ou posterior. Se escolheu `-G Ninja`, confira se o Ninja e o compilador estão disponíveis no terminal.

O CMake usa FetchContent para baixar dependências. Um erro de conexão, proxy ou Git pode interromper essa fase antes da compilação do motor. Preserve a mensagem original para distinguir uma falha de download de um erro de C++.

Se precisar mudar de gerador ou compilador, configure em um diretório novo; não reutilize um cache gerado com ferramentas diferentes.

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## O compilador não encontra recursos de C++20

O projeto solicita C++20 e usa recursos da biblioteca padrão como `std::format`. Selecionar o padrão não adiciona funções ausentes em uma biblioteca de compilador antiga. Verifique tanto a versão do compilador quanto sua biblioteca padrão.

Os caminhos de `.vscode` correspondem ao computador do autor. Um caminho inválido nessas opções não significa que você deva instalar as ferramentas no mesmo local.

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## O executável não encontra Config.json ou os recursos

Execute a partir da raiz, ao lado de `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

Não entre antes no diretório `Build`. A configuração, os shaders, as texturas, as fontes e os sons usam caminhos relativos. Verifique também se os nomes correspondem exatamente aos arquivos da sua cópia.

Um JSON inválido ou uma chave obrigatória ausente pode interromper a inicialização. Compare com o [arquivo de referência](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json) e preserve os tipos esperados.

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## Falhas em sistemas sensíveis a maiúsculas e minúsculas

A revisão auditada contém diferenças entre os caminhos do Git e os caminhos usados pelo código. Por exemplo, a árvore contém `Engine/Include/utils`, e vários includes usam `Utils`.

O Windows pode tolerar essas diferenças em sua configuração habitual. Outros sistemas podem rejeitá-las. A documentação não comprova compatibilidade com Linux/macOS nem apresenta a compilação nesses sistemas como verificada.

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu ou a tecla M encerram a execução

O Engine solicita uma cena chamada `Menu`, mas o SceneFactory não registra esse nome. Em Debug, uma asserção pode ser disparada; em outras configurações, a consulta ao mapa também pode falhar.

Evite o botão Menu, M e Select do controle nesta revisão. Use Escape para continuar, R para reiniciar ou Quit para fechar. Não há um seletor de cenas funcional que esta documentação possa recomendar.

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## O jogo pausa ao mudar de janela

É um comportamento definido: o Engine responde à perda de foco pausando a cena. O loop deixa de renderizar enquanto não tem foco e mantém o relógio atualizado. Se a sobreposição continuar visível ao voltar, use Resume ou Escape.

Na revisão pública de referência, cada cena controla sua resposta à pausa. A refatoração do relógio compartilhado de cooldowns observada no computador ainda era uma alteração local.

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## Os efeitos não aparecem ou mudam de aparência ao redimensionar

A cadeia só é configurada se `sf::Shader::isAvailable()` for verdadeiro. Quando criada, Bloom e Monitor estão ativos; Glitch e inversão não estão conectados ao fluxo normal.

As texturas de renderização são construídas com o tamanho da configuração. O callback de redimensionamento não as reconstrói, então não se deve esperar um sistema completo de resolução dinâmica.

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## Um controle responde de forma inesperada

O mapeamento de botões distingue o fabricante Microsoft e usa uma tabela alternativa para os demais controles. Revise `InputBindings.cpp` e a identificação fornecida pelo SFML. Não foi encontrada uma base de dados universal de controles nem remapeamento persistente em uma interface.

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## Os dados salvos não são apagados ao chamar Clear

O SaveManager esvazia os dados na memória, mas só grava ao ser destruído se ainda houver valores. Portanto, `Clear` não remove necessariamente o arquivo anterior. Antes de testar alterações, mantenha uma cópia de `Content/Save.json` e confira seu conteúdo com o aplicativo fechado.

Um arquivo de salvamento com JSON inválido também não tem recuperação geral implementada.

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## Uma captura não é salva

F12 salva em `Content/Screenshots`. Confira as permissões de escrita e o espaço disponível. O ScreenshotManager registra se conseguiu salvar a imagem; o som de captura só é reproduzido quando a operação de salvamento retorna sucesso.

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## Comunicar um problema reproduzível

Ao abrir uma issue no [repositório](https://github.com/Arukado01/AwesomeEngine), inclua o commit utilizado, sistema operacional, compilador, comando executado, diretório de trabalho, mensagem de erro e passos para reproduzir. Informe se sua cópia contém alterações locais: isso permite distinguir o código publicado do trabalho ainda em desenvolvimento.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Configuração de compilação](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Comportamento do Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Registro real de cenas](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Persistência do SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp).
