---
title: Rendu et effets
description: Découvrez le dessin d’une scène 2D, l’application de Bloom et Monitor, les vues et les particules.
order: 5
category: Systèmes
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## Une scène, une texture intermédiaire

RenderManager propose `Draw(const sf::Drawable&)` pour dessiner les objets SFML d’une scène. En interne, il les envoie vers `target_`, une `sf::RenderTexture` créée à la taille configurée.

Au début de l’image, `BeginDrawing` efface la cible et dessine le fond. `FinishDrawing` publie la texture, applique les effets et renvoie la texture qu’Engine présente dans la fenêtre. Les scènes n’ont pas besoin de gérer directement la fenêtre.

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## Chaîne de post-traitement

Voici la sélection d’effets du code de référence :

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom et Monitor sont ajoutés uniquement si les shaders sont disponibles. Pour appliquer plusieurs effets, `FinishDrawing` alterne deux cibles : la sortie d’une passe devient l’entrée de la suivante.

| Effet | Statut | Fonction |
| --- | --- | --- |
| Bloom | Implémenté et actif | Floute l’image à demi-résolution et ajoute le résultat à l’image d’origine. |
| Monitor | Implémenté et actif | Applique le shader de moniteur, avec la résolution et le temps en paramètres. |
| Glitch | Expérimental ; désactivé | Sa classe et son shader existent, mais son ajout au pipeline est commenté. |
| Inversion | Expérimental ; non connecté | Sa classe et son shader existent ; RenderManager ne l’ajoute pas à la chaîne. |

Le statut expérimental décrit l’intégration actuelle. Il ne présume aucune date prévue d’activation.

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## Les quatre étapes de Bloom

```text
Image de la scène
       ↓
1. Downsample → texture A, largeur et hauteur divisées par deux
       ↓
2. Blur vertical → texture B
       ↓
3. Blur horizontal → texture A
       ↓
4. Composition additive : original + texture A
```

`EffectBloom` charge `Default.vert`, `Downsample.frag`, `Blur.frag` et `Additive.frag` depuis `Content/Shaders`. Les textures intermédiaires sont dimensionnées lors de la construction de l’effet.

Cette organisation permet de décrire les passes existantes ; aucune mesure publiée ne permet de leur attribuer un pourcentage de gain de performances.

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## Vues et coordonnées

Le gestionnaire expose deux opérations simples :

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

Il s’agit d’un accès aux vues 2D de SFML. Il n’existe ni `CameraManager`, ni caméra 3D, ni système de suivi automatique. `CursorManager` permet de consulter la position du curseur convertie dans une `sf::View`.

La méthode de redimensionnement d’Engine enregistre la nouvelle taille de fenêtre, mais ne recrée pas les cibles de rendu. Il ne faut pas l’interpréter comme une prise en charge complète de la résolution dynamique.

<span id="partículas" aria-hidden="true"></span>

## Particules

`ParticleManager` conserve des particules avec une position, une vitesse, une accélération, une durée de vie, une taille et une couleur. `Update` fait avancer leur mouvement et supprime celles qui arrivent à leur terme ; `Render` dessine des carrés dont l’opacité diminue avec le temps.

La limite par défaut est de **128 particules**. Le vecteur réserve cette capacité et `Emit` ignore les nouvelles particules lorsque l’espace manque ou que leur durée de vie est invalide. Cette limite est un réglage d’implémentation, pas une mesure de la capacité maximale du moteur.

La scène décide quand mettre à jour et dessiner les particules. Engine les supprime lors d’un changement de scène. Runner utilise ce système pour la poussière liée au mouvement.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Pipeline de RenderManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/RenderManager.cpp).
- [Implémentation de Bloom](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Graphics/Effects/EfflectBloom.cpp).
- [Shader Monitor](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Shaders/Monitor.frag).
- [Particules](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ParticleManager.cpp).
