#!/bin/bash

# Script d'automatisation de release pour différents outils

echo "🔁 Sélectionne une méthode de release :"
echo "1) release-it"
echo "2) semantic-release"
echo "3) standard-version"
echo "4) script personnalisé (release.cjs)"
echo "-------------------------------"

# Choix de la méthode de release
read -p "Choix [1-4] : " choix
# Type de version (patch | minor | major) avec valeur par défaut
read -p "Type de version (patch | minor | major) [default: patch] : " bump

# Valeur par défaut
bump=${bump:-patch}

echo "🚀 Lancement de la release ($bump)..."

case $choix in
  1)
    # Lancer release-it sans confirmation en utilisant l'option --yes
    npx release-it $bump --ci --no-git.push
    ;;
  2)
    # Lancer semantic-release
    npx semantic-release
    ;;
  3)
    # Lancer standard-version avec l'option --release-as pour définir la version
    npx standard-version --release-as $bump
    ;;
  4)
    # Lancer le script personnalisé (release.cjs)
    node release.cjs $bump
    ;;
  *)
    echo "❌ Choix invalide. Abandon."
    exit 1
    ;;
esac

echo "✅ Release terminée avec succès."