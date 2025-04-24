const { execSync } = require('child_process');
const path = require('path');

// Définir le chemin absolu vers le fichier shell
const releaseScript = path.resolve(__dirname, 'release.sh');

// Définir le chemin vers bash (pour Windows, avec Git Bash)
const bashPath = 'C:\\Program Files\\Git\\bin\\bash.exe'; // Ajuste ce chemin si nécessaire

try {
  // Exécuter le fichier shell en utilisant Git Bash
  console.log("🚀 Lancement du script de release...");
  execSync(`"${bashPath}" ${releaseScript}`, { stdio: 'inherit' });
  console.log("✅ Release terminée.");
} catch (err) {
  console.error("❌ Erreur lors de l'exécution du script : ", err);
}