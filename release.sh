#!/bin/bash

# Script d'automatisation de release pour différents outils

echo "🔁 Sélectionne une méthode de release :"
echo "1) release-it"
echo "2) semantic-release"
echo "3) standard-version"
echo "4) script personnalisé (release.cjs)"
echo "-------------------------------"

read -p "Choix [1-4] : " choix
read -p "Type de version (patch | minor | major) [default: patch] : " bump

# Valeur par défaut
bump=${bump:-patch}

echo "🚀 Lancement de la release ($bump)..."

case $choix in
  1)
    npx release-it $bump
    ;;
  2)
    npx semantic-release
    ;;
  3)
    npx standard-version --release-as $bump
    ;;
  4)
    node release.cjs $bump
    ;;
  *)
    echo "❌ Choix invalide. Abandon."
    exit 1
    ;;
esac

echo "✅ Release terminée avec succès."