const { execSync } = require('child_process');

const bump = process.argv[2] || 'patch';

// Fonction pour obtenir le dernier tag
function getLatestGitTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0').toString().trim();
    return tag.startsWith('v') ? tag.slice(1) : tag; // Supprimer le 'v' si présent
  } catch {
    return null; // Si aucun tag, retourne null
  }
}

// Fonction pour incrémenter une version semver
function bumpVersion(version, level) {
  const parts = version.split('.').map(Number);
  if (level === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (level === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}

try {
  // Déterminer la dernière version
  let latestTag = getLatestGitTag();
  let newVersion = bumpVersion(latestTag || '0.0.0', bump);

  // Vérifier si ce tag existe déjà
  try {
    execSync(`git rev-parse v${newVersion}`);
    console.log(
      `⚠️ Tag v${newVersion} existe déjà. Incrémentation à la version suivante...`
    );
    newVersion = bumpVersion(newVersion, bump); // Incrémenter encore si le tag existe
  } catch {
    // Pas de problème si le tag n'existe pas
  }

  console.log(`🚀 Nouvelle version : v${newVersion}`);

  // Mise à jour de package.json sans créer un tag Git
  execSync(`npm version ${newVersion} --no-git-tag-version`, {
    stdio: 'inherit',
  });

  // Commit et push des changements
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): v${newVersion}"`, {
    stdio: 'inherit',
  });

  // Création du tag et push du tag vers GitHub
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  execSync('git push origin HEAD:main && git push --tags', {
    stdio: 'inherit',
  });

  // Publication sur npm
  execSync('npm publish', { stdio: 'inherit' });

  console.log(`✅ Release v${newVersion} publiée avec succès.`);
} catch (err) {
  console.error(`❌ Erreur pendant la release : ${err.message || err}`);
  process.exit(1);
}
