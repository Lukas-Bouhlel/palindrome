const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Fonction pour obtenir la version actuelle du package.json
function getCurrentPackageVersion() {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

try {
  // Déterminer la dernière version
  let latestTag = getLatestGitTag();
  let newVersion = bumpVersion(latestTag || '0.0.0', bump);

  // Vérifier si ce tag existe déjà
  while (true) {
    try {
      execSync(`git rev-parse v${newVersion}`);
      console.log(
        `⚠️ Tag v${newVersion} existe déjà. Incrémentation à la version suivante...`
      );
      newVersion = bumpVersion(newVersion, bump); // Incrémenter encore si le tag existe
    } catch {
      // Pas de problème si le tag n'existe pas
      break;
    }
  }

  // Vérifier si la version existe déjà dans package.json
  const currentVersion = getCurrentPackageVersion();
  if (newVersion === currentVersion) {
    console.log(
      `⚠️ La version v${newVersion} existe déjà dans package.json. Incrémentation à la version suivante...`
    );
    newVersion = bumpVersion(newVersion, bump); // Incrémenter encore si la version existe
  }

  console.log(`🚀 Nouvelle version : v${newVersion}`);

  // Mise à jour de package.json sans créer un tag Git
  console.log(`Tentative de mise à jour de la version vers v${newVersion}`);
  try {
    execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Erreur lors de la mise à jour de la version : ${err.message}`);
    throw err;
  }

  // Création du tag et push du tag vers GitHub
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  execSync('git push --tags', { stdio: 'inherit' });

  console.log(`✅ Release v${newVersion} publiée avec succès.`);
} catch (err) {
  console.error(`❌ Erreur pendant la release : ${err.message || err}`);
  process.exit(1);
}