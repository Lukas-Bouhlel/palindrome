const { execSync } = require("child_process");
const fs = require("fs");
const pkg = require("./package.json");

const bump = process.argv[2] || "patch"; // patch, minor, major
execSync(`npm version ${bump}`, { stdio: "inherit" });

// Génère le changelog (ici, version ultra simple)
const newVersion = require("./package.json").version;
fs.appendFileSync("CHANGELOG.md", `\n## ${newVersion} - ${new Date().toISOString().split('T')[0]}\n- Release automatique\n`);

execSync("git add .", { stdio: "inherit" });
execSync(`git commit -m "chore(release): v${newVersion}"`, { stdio: "inherit" });
execSync(`git tag v${newVersion}`, { stdio: "inherit" });
execSync("git push && git push --tags", { stdio: "inherit" });