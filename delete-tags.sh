#!/bin/bash

# Version à partir de laquelle supprimer les tags
TARGET_VERSION="0.0.27"

# Lister tous les tags
tags=$(git tag)

# Parcourir les tags et supprimer ceux qui sont après la version cible
for tag in $tags; do
  if [[ "$tag" > "$TARGET_VERSION" ]]; then
    # Supprimer le tag local
    git tag -d "$tag"
    echo "Tag local $tag supprimé"

    # Supprimer le tag distant
    git push origin :refs/tags/"$tag"
    echo "Tag distant $tag supprimé"
  fi
done