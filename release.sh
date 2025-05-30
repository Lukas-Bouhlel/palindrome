#!/bin/bash

# Script d'automatisation de release pour différents outils

echo "🔁 Sélectionne une méthode de release :"
echo "1) release-it"
echo "2) standard-version"
echo "3) script personnalisé (release.cjs)"
echo "-------------------------------"

# Choix de la méthode de release
read -p "Choix [1-3] [default: 3] : " choix
# Type de version (patch | minor | major) avec valeur par défaut
read -p "Type de version (patch | minor | major) [default: patch] : " bump

# Valeur par défaut
bump=${bump:-patch}

echo "🚀 Lancement de la release ($bump)..."

case $choix in
  1)
    # Lancer release-it sans confirmation en utilisant l'option --yes
    npx release-it $bump --ci --no-changelog
    ;;
  2)
    # Lancer standard-version avec l'option --release-as pour définir la version
    npx standard-version --release-as $bump
    ;;
  3)
    # Lancer le script personnalisé (release.cjs)
    node release.cjs $bump
    ;;
  *)
    node release.cjs $bump
    ;;
esac

echo "✅ Release terminée avec succès."