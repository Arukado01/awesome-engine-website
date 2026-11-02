---
title: Dépannage
description: Diagnostics concrets pour la compilation, les ressources, les commandes, les sauvegardes et les limites de la révision auditée.
order: 9
category: Référence
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## CMake ne configure pas le projet

Vérifiez que vous êtes à la bonne racine et que `cmake --version` indique la version 3.28 ou ultérieure. Si vous avez choisi `-G Ninja`, assurez-vous que Ninja et le compilateur sont disponibles dans le terminal.

CMake utilise FetchContent pour télécharger les dépendances. Un problème de connexion, de proxy ou de Git peut interrompre cette phase avant la compilation du moteur. Conservez le message d’origine pour distinguer un téléchargement échoué d’une erreur C++.

Si vous devez changer de générateur ou de compilateur, configurez un nouveau répertoire ; ne réutilisez pas un cache créé avec d’autres outils.

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## Le compilateur ne trouve pas certaines fonctions de C++20

Le projet demande C++20 et utilise des fonctions de la bibliothèque standard telles que `std::format`. Sélectionner la norme n’ajoute pas les fonctions absentes d’une ancienne bibliothèque de compilateur. Vérifiez à la fois la version du compilateur et celle de sa bibliothèque standard.

Les chemins de `.vscode` correspondent à l’ordinateur de l’auteur. Un chemin invalide dans ces options ne signifie pas que vous devez installer les outils au même emplacement.

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## L’exécutable ne trouve pas Config.json ou les ressources

Lancez-le depuis la racine, à côté de `Content` :

```powershell
.\Build\AwesomeEngine.exe
```

Ne vous placez pas d’abord dans le répertoire `Build`. La configuration, les shaders, textures, polices et sons utilisent des chemins relatifs. Vérifiez aussi que les noms correspondent exactement aux fichiers de votre copie.

Un JSON invalide ou une clé obligatoire absente peut interrompre le démarrage. Comparez avec le [fichier de référence](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json) et conservez les types attendus.

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## Échecs sur les systèmes sensibles à la casse

La révision auditée contient des différences entre les chemins de Git et ceux utilisés par le code. Par exemple, l’arborescence contient `Engine/Include/utils` alors que plusieurs includes utilisent `Utils`.

Windows peut tolérer ces différences dans sa configuration habituelle. D’autres systèmes peuvent les refuser. La documentation ne valide pas la compatibilité Linux/macOS et ne présente pas leur compilation comme vérifiée.

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu ou la touche M arrêtent l’application

Engine demande une scène nommée `Menu`, mais SceneFactory n’enregistre pas ce nom. En Debug, cela peut déclencher une assertion ; dans d’autres configurations, la consultation de la table peut également échouer.

Évitez le bouton Menu, M et Select de la manette dans cette révision. Utilisez Échap pour continuer, R pour redémarrer ou Quit pour fermer. Il n’existe pas de sélecteur de scènes fonctionnel que cette documentation puisse recommander.

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## Le jeu se met en pause en changeant de fenêtre

C’est le comportement prévu : Engine répond à la perte du focus en mettant la scène en pause. La boucle suspend le rendu sans focus, mais maintient l’horloge à jour. Si le panneau reste visible au retour, utilisez Resume ou Échap.

Dans la révision publique de référence, chaque scène contrôle sa réaction à la pause. La refactorisation observée de l’horloge partagée des délais de récupération était encore un changement local.

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## Les effets sont absents ou changent d’aspect au redimensionnement

La chaîne est configurée uniquement si `sf::Shader::isAvailable()` renvoie vrai. Lorsqu’elle est créée, Bloom et Monitor sont actifs ; Glitch et l’inversion ne sont pas reliés au fonctionnement normal.

Les textures de rendu sont créées avec la taille configurée. Le callback de redimensionnement ne les reconstruit pas ; il ne faut donc pas attendre un système complet de résolution dynamique.

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## Une manette réagit de manière inattendue

La correspondance des boutons distingue le fabricant Microsoft et utilise une table alternative pour les autres manettes. Vérifiez `InputBindings.cpp` et l’identification fournie par SFML. Aucune base de données universelle de commandes ni interface de réaffectation persistante n’a été trouvée.

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## La sauvegarde n’est pas effacée par Clear

SaveManager vide les données en mémoire, mais n’écrit lors de sa destruction que s’il conserve des valeurs. `Clear` ne supprime donc pas nécessairement le fichier précédent. Avant de tester des changements, copiez `Content/Save.json` et vérifiez son contenu avec l’application fermée.

Aucune récupération générale n’est non plus implémentée pour une sauvegarde contenant un JSON invalide.

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## Une capture n’est pas enregistrée

F12 enregistre dans `Content/Screenshots`. Vérifiez les droits d’écriture et l’espace disponible. ScreenshotManager indique dans les journaux si l’image a été enregistrée ; le son de capture n’est joué que lorsque l’opération d’enregistrement réussit.

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## Signaler un problème reproductible

Lors de l’ouverture d’un ticket dans le [dépôt](https://github.com/Arukado01/AwesomeEngine), indiquez le commit utilisé, le système d’exploitation, le compilateur, la commande exécutée, le répertoire de travail, le message d’erreur et les étapes de reproduction. Précisez si votre copie contient des changements locaux pour distinguer le code publié du travail encore en développement.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Configuration de compilation](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Comportement d’Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Registre réel des scènes](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Persistance de SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp).
