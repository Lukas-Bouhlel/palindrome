# Rapport de Release

Outils Testés :
release-it
standard-version
Script personnalisé (release.cjs)

# Forces et Faiblesses de Chaque Outil

1. release-it
   Forces :

Automatisation Complète : Automatise le processus de release, y compris la création de tags, la mise à jour du changelog, et le push vers le dépôt.
Options de Configuration : Permet de configurer facilement les options de release via des flags ou un fichier de configuration.
Intégration CI : Supporte bien l'intégration continue avec l'option --ci.

Faiblesses :

Dépendance Externe : Nécessite l'installation de release-it via npm, ce qui peut ajouter une dépendance supplémentaire au projet.
Complexité de Configuration : Peut être complexe à configurer pour des besoins spécifiques.

2. standard-version
   Forces :

Gestion du Changelog : Gère automatiquement la mise à jour du changelog en suivant les conventions de commit.
Simplicité : Facile à utiliser avec des commandes simples pour définir le type de version (--release-as).
Intégration CI : Bien adapté pour les environnements CI/CD.

Faiblesses :

Moins de Flexibilité : Moins flexible que release-it pour des configurations spécifiques.
Dépendance Externe : Nécessite l'installation de standard-version via npm.

3. Script Personnalisé (release.cjs)
   Forces :

Contrôle Total : Offre un contrôle total sur le processus de release, permettant des personnalisations spécifiques.
Indépendance : Ne dépend pas de bibliothèques externes pour la logique de release.
Flexibilité : Peut être facilement modifié pour ajouter ou changer des fonctionnalités.

Faiblesses :

Maintenance : Nécessite une maintenance continue pour s'assurer qu'il fonctionne correctement avec les mises à jour du projet.
Complexité : Peut être plus complexe à comprendre et à maintenir pour les nouveaux développeurs.
