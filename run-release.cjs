const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
process.env.CI = 'true'; 

// Définir le chemin absolu vers le fichier shell
const releaseScript = path.resolve(__dirname, 'release.sh');

// Définir le chemin vers bash (pour Windows, avec Git Bash)
const bashPath = 'C:\\Program Files\\Git\\bin\\bash.exe'; // Ajuste ce chemin si nécessaire

// Fonction pour mettre à jour le changelog
function updateChangelog(newVersion) {
  const changelogPath = path.resolve(__dirname, 'CHANGELOG.md');
  const changelogEntry = `\n## v${newVersion} - ${new Date().toISOString().split("T")[0]}\n- Auto release\n`;

  // Ajout de l'entrée au changelog
  fs.appendFileSync(changelogPath, changelogEntry);
  console.log(`Changelog mis à jour avec la version v${newVersion}`);
}

try {
  // Exécuter le fichier shell en utilisant Git Bash
  console.log("🚀 Lancement du script de release...");
  execSync(`"${bashPath}" ${releaseScript}`, { stdio: 'inherit' });
  
  // Après avoir exécuté le script, on met à jour le changelog
  const packageJson = require(path.resolve(__dirname, 'package.json'));
  const newVersion = packageJson.version;  // Récupérer la version du package.json
  
  // Mettre à jour le changelog
  updateChangelog(newVersion);

  console.log("✅ Release terminée.");
} catch (err) {
  console.error("❌ Erreur lors de l'exécution du script : ", err);
}