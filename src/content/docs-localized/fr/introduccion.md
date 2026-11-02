---
title: Introduction
description: Découvrez le contenu d’Awesome Engine, ce que son code permet d’étudier et le statut de chaque système.
order: 1
category: Premiers pas
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## Un moteur 2D à explorer de l’intérieur

Awesome Engine est un moteur de jeux vidéo écrit en **C++20**, construit sur SFML. Son noyau relie les scènes aux services de rendu, de ressources, d’entrée, d’audio, d’interface et de persistance. Les jeux du dépôt montrent comment utiliser ces services en C++.

Cette documentation prend pour référence le [commit `5a6dfac`](https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126). Elle décrit le contenu de cette révision ; les changements observés uniquement dans l’arborescence locale sont signalés comme **en développement**.

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## Ce que vous trouverez

- **Sept scènes de jeu :** Bounce, Clicker, MemoryCard, TicTacToe, MineSweeper, Runner et Tetris.
- **Rendu 2D :** objets dessinables SFML, textures intermédiaires et post-traitement Bloom et Monitor.
- **Entrées par actions :** clavier, souris et manettes, avec plusieurs associations pour une même action.
- **Services partagés :** ressources, temps, audio, particules, sauvegarde JSON et captures PNG.
- **Interface TGUI :** widgets et panneau de pause intégrés aux événements de la fenêtre.

Ces systèmes sont reliés par `EngineContext`. Chaque jeu implémente l’interface `Scene` et conserve ses propres objets et règles. La révision documentée ne contient ni architecture ECS ni éditeur visuel.

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## Le parcours recommandé

1. [Installez et compilez le projet](/fr/docs/instalacion/).
2. [Vérifiez la configuration d’exécution](/fr/docs/configuracion/).
3. [Suivez la boucle du moteur et ses dépendances](/fr/docs/arquitectura/).
4. [Consultez le contrat des scènes](/fr/docs/escenas/).
5. Explorez le [rendu](/fr/docs/renderizado/), les [ressources](/fr/docs/recursos/) et les [entrées et l’audio](/fr/docs/entrada-audio/).

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## Comment interpréter les statuts

| Statut | Signification sur ce site |
| --- | --- |
| Implémenté | Du code concret existe dans la révision de référence. Cela ne certifie pas toutes les plateformes ni tous les cas d’utilisation. |
| En développement | Une implémentation ou des changements existent dans l’arborescence locale, mais pas encore dans le commit de référence. |
| Expérimental | Le code existe, mais son intégration est désactivée ou ne participe pas au fonctionnement normal décrit. |
| Planifié | Une intention documentée par le projet est nécessaire. Aucune fonctionnalité ne reçoit ce statut sans cette preuve. |

`AudioGroup`, `SpriteAnimator`, `SweptAabb` et l’horloge partagée des délais de récupération ont été observés dans le travail local. Ces API ne sont pas disponibles en clonant la révision de référence.

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## Portée des plateformes

Le dépôt comprend une configuration de travail pour **Windows avec MinGW, Ninja et GDB**. L’audit ne valide pas la compilation ou l’exécution sous Linux, macOS, sur mobile ou dans un navigateur. Les bibliothèques utilisées ne suffisent pas, à elles seules, à affirmer une compatibilité complète du moteur.

Le code du moteur est sous [licence MIT](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md). Les intitulés de l’historique correspondent à de vrais commits, et non à des versions de publication inventées.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Dépendances et options de compilation](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Enregistrement des scènes](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Services d’EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
