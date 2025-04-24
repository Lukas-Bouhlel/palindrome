const { execSync } = require('child_process');

const bump = process.argv[2] || 'patch';

try {
  // Fonction pour obtenir le dernier tag
  function getLatestGitTag() {
    try {
      const tag = execSync('git describe --tags --abbrev=0').toString().trim();
      return tag.startsWith('v') ? tag.slice(1) : tag;
    } catch {
      return null;
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

  // Détermination de la nouvelle version
  let latestTag = getLatestGitTag();
  let newVersion = bumpVersion(latestTag || '0.0.0', bump);

  try {
    execSync(`git rev-parse v${newVersion}`);
    console.log(`⚠️ Tag v${newVersion} existe déjà. On passe à la version suivante...`);
    newVersion = bumpVersion(newVersion, bump);
  } catch {
    // OK, le tag n'existe pas encore
  }

  console.log(`🚀 Nouvelle version : v${newVersion}`);

  // Mise à jour du package.json
  execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'inherit' });

  // Commit, tag, push
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): v${newVersion}"`, { stdio: 'inherit' });
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });

  const ref = process.env.GITHUB_REF || '';
  const branch = ref.replace('refs/heads/', '') || 'main';

  execSync(`git push origin HEAD:${branch} && git push --tags`, { stdio: 'inherit' });

  // Publication npm
  execSync('npm publish', { stdio: 'inherit' });

  console.log(`✅ Release v${newVersion} publiée avec succès.`);
} catch (err) {
  console.error(`❌ Erreur pendant la release : ${err.message || err}`);
  process.exit(1);
}