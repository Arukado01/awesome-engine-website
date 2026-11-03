---
title: Scènes et cycle de vie
description: Le contrat Scene, l’enregistrement des jeux, les transitions différées et le nettoyage de l’état.
order: 7
category: Cœur du moteur
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## Le contrat d’une scène

Une scène reçoit `EngineContext` par référence et définit comment démarrer, se mettre à jour et se dessiner. Ce contrat existe dans la révision de référence :

```cpp
class Scene {
protected:
  EngineContext &ctx;

public:
  Scene(EngineContext &context) : ctx(context) {}
  virtual ~Scene() = default;

  virtual void Start() = 0;
  virtual void Update() = 0;
  virtual void Render() const = 0;

  virtual void OnEvent(const sf::Event &) {};
  virtual void OnPause(bool /* pausa */) {};
  virtual void OnCleanup() {};
};
```

`Start`, `Update` et `Render` sont obligatoires. Les autres callbacks ont une implémentation vide et sont spécialisés lorsque le jeu en a besoin.

<span id="responsabilidades-por-etapa" aria-hidden="true"></span>

## Responsabilités de chaque étape

| Étape | Moment | Utilisation dans le jeu |
| --- | --- | --- |
| Constructeur | Lors de la création du registre initial des scènes. | Préparer les objets et ressources de l’instance. |
| `Start` | À l’activation ou au redémarrage de la scène. | Réinitialiser la partie et enregistrer ses commandes. |
| `OnEvent` | À la réception d’événements lorsque le panneau est masqué. | Traiter les événements ponctuels du jeu. |
| `Update` | À chaque image, avec le focus et sans panneau visible. | Faire avancer la logique, le mouvement et l’état. |
| `Render` | Lors du dessin de l’image de la scène active. | Envoyer les objets à `ctx.renderer`. |
| `OnPause` | Lorsque l’état de pause change. | Suspendre ou reprendre les éléments contrôlés par la scène. |
| `OnCleanup` | Avant de quitter ou de redémarrer la scène. | Arrêter l’audio et nettoyer l’état qui ne doit pas persister. |

Le constructeur et `Start` ne sont pas équivalents. Les instances restent dans le registre et peuvent recevoir plusieurs appels à `Start`.

<span id="registro-de-juegos" aria-hidden="true"></span>

## Enregistrement des jeux

`SceneFactory::Scenes` est un `unordered_map` qui associe des noms à des `unique_ptr<Scene>`. La fabrique enregistre sept instances :

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

La révision documentée demande Tetris dans le constructeur d’Engine. Les noms sont les clés exactes du registre ; aucune procédure de récupération n’est implémentée pour une scène inconnue.

<span id="transición-diferida" aria-hidden="true"></span>

## Transition différée

`SceneManager::ChangeScene` mémorise le nom demandé s’il n’y a pas déjà un autre changement en attente. Engine consomme cette demande au début du traitement d’événements suivant.

```text
ChangeScene(nom)
     ↓
Demande en attente
     ↓
Prochain ProcessEvent
     ↓
OnCleanup de la scène précédente
     ↓
Nettoyage des particules et des liaisons d’entrée
     ↓
Changement du pointeur actif
     ↓
Start de la scène demandée
     ↓
Synchronisation de la pause
```

`RestartCurrentScene` utilise le même mécanisme avec le nom actuel. Il ne détruit ni ne reconstruit l’objet : `Start` doit donc ramener la partie dans un état valide même lors d’appels répétés.

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## Explorer une implémentation réelle

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Games/Source/Bounce.cpp) montre comment une classe de jeu reçoit le contexte, prépare sa raquette et ses statistiques, demande des sons et de la musique et utilise les callbacks de scène.

Pour ajouter une scène dans votre copie, suivez la séparation existante : déclaration dans `Games/Include`, implémentation dans `Games/Source` et enregistrement explicite dans `SceneFactory.cpp`. CMake découvre les `.cpp` de ces dossiers avec `GLOB_RECURSE CONFIGURE_DEPENDS` ; il n’existe pas de plugin de scènes chargé à l’exécution.

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

## Limite de l’accès au menu

Le panneau comprend un bouton **Menu**, et le raccourci **M** appelle le même chemin. Engine demande une scène nommée `Menu`, mais la fabrique de cette révision ne l’enregistre pas. Évitez cette action en explorant cette version : elle peut déclencher une assertion ou une exception pour une clé inexistante.

Cette documentation conserve explicitement cette limite ; elle ne présente pas le menu comme un sélecteur de jeux disponible.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Contrat Scene](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/Scene.h).
- [Registre SceneFactory](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp).
- [Demandes de SceneManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SceneManager.cpp).
- [Transitions dans Engine](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
