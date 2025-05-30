const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
process.env.CI = 'true';

// Définir le chemin absolu vers le fichier shell
const releaseScript = path.resolve(__dirname, 'release.sh');

// Définir le chemin vers bash en fonction de l'environnement
const isWindows = process.platform === 'win32';
const bashPath = isWindows ? 'C:\\Program Files\\Git\\bin\\bash.exe' : 'bash';

// Fonction pour mettre à jour le changelog
function updateChangelog(newVersion) {
  const changelogPath = path.resolve(__dirname, 'CHANGELOG.md');
  const changelogEntry = `\n## v${newVersion} - ${new Date().toISOString().split('T')[0]}\n- Auto release\n`;

  // Ajout de l'entrée au changelog
  fs.appendFileSync(changelogPath, changelogEntry);
  console.log(`Changelog mis à jour avec la version v${newVersion}`);
}

// Fonction pour vérifier et commiter les fichiers modifiés
function commitChanges() {
  try {
    const status = execSync('git status --porcelain').toString().trim();
    if (status) {
      console.log(
        'Modifications non commités, ajout et commit des changements...'
      );
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "chore: update changelog for release"', {
        stdio: 'inherit',
      });
      execSync('git push', { stdio: 'inherit' }); // Push les modifications sur le repo
    } else {
      console.log('Aucun changement non commités.');
    }
  } catch (error) {
    console.error('Erreur lors du commit des modifications:', error);
    throw error; // Stopper le processus en cas d'erreur
  }
}

try {
  // Lancer le script de release
  console.log('🚀 Lancement du script de release...');
  execSync(`"${bashPath}" ${releaseScript}`, { stdio: 'inherit' });

  // Après avoir exécuté le script, on met à jour le changelog
  const packageJson = require(path.resolve(__dirname, 'package.json'));
  const newVersion = packageJson.version;

  // Mettre à jour le changelog
  updateChangelog(newVersion);

  // Commiter les changements avant de lancer la release
  commitChanges();

  console.log('✅ Release terminée.');
} catch (err) {
  console.error('❌ Erreur lors de lexécution du script : ', err);
}
