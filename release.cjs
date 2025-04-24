const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const bump = process.argv[2] || "patch"; // patch, minor, major

// Fonction utilitaire : obtenir la dernière version taguée
function getLatestGitTag() {
  try {
    const tag = execSync("git describe --tags --abbrev=0").toString().trim();
    return tag.startsWith("v") ? tag.slice(1) : tag;
  } catch {
    return null;
  }
}

// Fonction : incrémente une version semver
function bumpVersion(version, level) {
  const parts = version.split(".").map(Number);
  if (level === "major") {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (level === "minor") {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join(".");
}

// 1. Vérifie si le tag existe déjà
let latestTag = getLatestGitTag();
let newVersion = bumpVersion(latestTag || "0.0.0", bump);

try {
  execSync(`git rev-parse v${newVersion}`);
  console.log(`⚠️ Tag v${newVersion} existe déjà. On passe à la version suivante...`);
  newVersion = bumpVersion(newVersion, bump);
} catch {
  // Tag doesn't exist, continue
}

console.log(`🚀 Nouvelle version : v${newVersion}`);

// 2. Met à jour le package.json
execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: "inherit" });

// 3. Met à jour le changelog
const changelogPath = path.resolve("CHANGELOG.md");
const changelogEntry = `\n## v${newVersion} - ${new Date().toISOString().split("T")[0]}\n- Auto release\n`;
fs.appendFileSync(changelogPath, changelogEntry);

// 4. Commit + tag + push
execSync("git add .", { stdio: "inherit" });
execSync(`git commit -m "chore(release): v${newVersion}"`, { stdio: "inherit" });
execSync(`git tag v${newVersion}`, { stdio: "inherit" });
execSync("git push && git push --tags", { stdio: "inherit" });

// 5. (Optionnel) Publish
// execSync("npm publish", { stdio: "inherit" });
