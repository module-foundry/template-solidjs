import { readdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceDirectory = path.join(rootDirectory, "src");
const isDryRun = process.argv.includes("--dry-run");

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const getRenamedFileName = (fileName) => {
  const extension = path.extname(fileName);
  const baseName = fileName.slice(0, -extension.length);
  const kebabBaseName = toKebabCase(baseName);

  return kebabBaseName
    ? `${kebabBaseName}${extension.toLowerCase()}`
    : fileName;
};

const collectRenameTargets = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const targets = [];

  for (const entry of entries) {
    const currentPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      targets.push(...(await collectRenameTargets(currentPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const nextName = getRenamedFileName(entry.name);

    if (nextName === entry.name) {
      continue;
    }

    targets.push({
      from: currentPath,
      temporary: path.join(
        directory,
        `.${entry.name}.${Date.now()}.rename-tmp`,
      ),
      to: path.join(directory, nextName),
    });
  }

  return targets;
};

const assertNoCollisions = (targets) => {
  const usedPaths = new Map();

  for (const target of targets) {
    const normalizedPath = target.to.toLowerCase();
    const existingPath = usedPaths.get(normalizedPath);

    if (existingPath) {
      throw new Error(
        `Rename collision:\n- ${existingPath}\n- ${target.from}\nBoth map to ${target.to}`,
      );
    }

    usedPaths.set(normalizedPath, target.from);
  }
};

const renameFiles = async () => {
  const targets = await collectRenameTargets(sourceDirectory);

  assertNoCollisions(targets);

  if (targets.length === 0) {
    console.log("All files in src already use kebab-case names.");
    return;
  }

  for (const target of targets) {
    console.log(
      `${path.relative(rootDirectory, target.from)} -> ${path.relative(rootDirectory, target.to)}`,
    );
  }

  if (isDryRun) {
    console.log(`Dry run: ${targets.length} file(s) would be renamed.`);
    return;
  }

  for (const target of targets) {
    await rename(target.from, target.temporary);
  }

  for (const target of targets) {
    await rename(target.temporary, target.to);
  }

  console.log(`Renamed ${targets.length} file(s).`);
};

await renameFiles();
