---
title: Renderização e efeitos
description: Como uma cena 2D é desenhada, Bloom e Monitor são aplicados e as vistas e partículas são controladas.
order: 5
category: Sistemas
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## Uma cena, uma textura intermediária

O RenderManager oferece `Draw(const sf::Drawable&)` para desenhar os objetos SFML de uma cena. Internamente, ele os envia para `target_`, uma `sf::RenderTexture` criada com o tamanho da configuração.

No início do quadro, `BeginDrawing` limpa o alvo e desenha o fundo. `FinishDrawing` publica a textura, aplica os efeitos e retorna a textura que o Engine apresenta na janela. As cenas não precisam gerenciar a janela diretamente.

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## Cadeia de pós-processamento

Esta é a seleção de efeitos do código de referência:

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom e Monitor só são adicionados se os shaders estiverem disponíveis. Para aplicar vários efeitos, `FinishDrawing` alterna entre dois alvos: a saída de uma passagem se torna a entrada da seguinte.

| Efeito | Estado | Função |
| --- | --- | --- |
| Bloom | Implementado e ativo | Desfoca a imagem em meia resolução e soma o resultado à imagem original. |
| Monitor | Implementado e ativo | Aplica o shader de monitor, com resolução e tempo como parâmetros. |
| Glitch | Experimental; desativado | Sua classe e seu shader existem, mas a inclusão no pipeline está comentada. |
| Inversão | Experimental; não conectada | Sua classe e seu shader existem; o RenderManager não o adiciona à cadeia. |

O rótulo experimental descreve a integração atual. Não pressupõe uma data prevista para ativação.

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## As quatro etapas de Bloom

```text
Imagem da cena
       ↓
1. Downsample → textura A, metade da largura e da altura
       ↓
2. Blur vertical → textura B
       ↓
3. Blur horizontal → textura A
       ↓
4. Composição aditiva: original + textura A
```

`EffectBloom` carrega `Default.vert`, `Downsample.frag`, `Blur.frag` e `Additive.frag` de `Content/Shaders`. As texturas intermediárias são dimensionadas ao construir o efeito.

Essa organização permite descrever as passagens existentes; não há medições publicadas que sustentem um percentual de melhoria de desempenho.

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## Vistas e coordenadas

O manager expõe duas operações simples:

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

Trata-se de acesso às vistas 2D do SFML. Não existe `CameraManager`, câmera 3D nem sistema automático de acompanhamento. `CursorManager` permite consultar a posição do cursor convertida para uma `sf::View`.

O método de redimensionamento do Engine registra o novo tamanho da janela, mas não recria os alvos de renderização. Isso não deve ser interpretado como suporte completo à resolução dinâmica.

## Partículas

`ParticleManager` mantém partículas com posição, velocidade, aceleração, tempo de vida, tamanho e cor. `Update` avança o movimento e remove as que terminam; `Render` desenha quadrados que perdem opacidade com o tempo.

O limite padrão é de **128 partículas**. O vetor reserva essa capacidade, e `Emit` descarta novas partículas quando não há espaço ou o tempo de vida é inválido. O limite é uma configuração da implementação, não uma medida da capacidade máxima do motor.

A cena decide quando atualizar e renderizar as partículas. O Engine as limpa ao mudar de cena. Runner usa esse sistema para a poeira do movimento.

`EmitBurst` cria partículas com `ParticleEmitterConfig` e `RandomManager`. Valida os intervalos e limita a criação à capacidade disponível.

<span id="animación-y-colisiones" aria-hidden="true"></span>

## Animação e colisões

`SpriteAnimator` avança clipes em loop ou uma vez, informa quadros atravessados e calcula retângulos de spritesheets. `AnimationManager` gerencia identificadores, grupos e pausas; Runner obtém um animador e avança sua corrida diretamente.

`CollisionManager` oferece `Intersect` e `Sweep` para caixas alinhadas aos eixos. A varredura retorna tempo de contato, normal e sobreposição inicial; Runner e Bounce a usam em colisões selecionadas. Não é um motor físico geral.

Crie e configure o animador uma vez; mantenha o grupo e avance-o a cada atualização:

```cpp
const AnimationGroup group = 1;
const AnimationHandle handle = ctx.animations.Create(group);
ctx.animations.Configure(handle, {0, 6, 12.f}, SpritePlaybackMode::Loop);
ctx.animations.AdvanceGroup(group, ctx.time.GetDeltaTime());
```

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Pipeline do RenderManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/RenderManager.cpp).
- [Implementação de Bloom](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Graphics/Effects/EfflectBloom.cpp).
- [Shader Monitor](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Shaders/Monitor.frag).
- [Partículas](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ParticleManager.cpp).

- [AnimationManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AnimationManager.h).
- [SpriteAnimator](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Graphics/SpriteAnimator/SpriteAnimator.h).
- [CollisionManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/CollisionManager.h).
