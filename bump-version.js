// npm run version:bump major will change 0.0.0 to 1.0.0
// npm run version:bump minor will change 0.0.0 to 0.1.0
// npm run version:bump patch will change 0.0.0 to 0.0.1

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, "package.json");
const packageLockJsonPath = path.resolve(__dirname, "package-lock.json");

function bumpVersion(type = "patch") {
  if (!fs.existsSync(packageJsonPath)) {
    console.error("package.json not found!");
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  let [major, minor, patch] = packageJson.version.split(".").map(Number);

  switch (type) {
    case "major":
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor += 1;
      patch = 0;
      break;
    case "patch":
    default:
      patch += 1;
      break;
  }

  packageJson.version = `${major}.${minor}.${patch}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Version bumped to ${packageJson.version}`);

  if (!fs.existsSync(packageLockJsonPath)) {
    console.error("package-lock.json not found!");
    return;
  }
  const packageLockJson = JSON.parse(
    fs.readFileSync(packageLockJsonPath, "utf8")
  );
  packageLockJson.version = packageJson.version;
  fs.writeFileSync(
    packageLockJsonPath,
    JSON.stringify(packageLockJson, null, 2)
  );
  console.log(`package-lock.json version bumped to ${packageLockJson.version}`);
}

const args = process.argv.slice(2);
const bumpType = args[0] || "patch";

bumpVersion(bumpType);
