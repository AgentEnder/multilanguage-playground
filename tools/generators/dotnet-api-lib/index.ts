import {
  Tree,
  formatFiles,
  addProjectConfiguration,
} from '@nrwl/devkit';
import { ensureDirSync, removeSync } from 'fs-extra';
import { execSync } from 'child_process';

export default async function (tree: Tree, schema: any) {
  // SETUP
  const dir = schema.dir = `libs/${schema.name}`;
  const isDryRun = process.argv.some((x) => x === '--dry-run');

  if (tree.exists(dir)) {
    throw 'This library already exists!';
  }

  // CREATE
  ensureDirSync(dir);
  execSync(`dotnet new classlib ${isDryRun ? '--dry-run' : ''}`, {
    stdio: 'inherit',
    cwd: dir,
  });
  addDotnetProject(tree, schema);
  // CLEANUP
  addProjectConfiguration;
  if (isDryRun) {
    removeSync(dir);
  }

  return formatFiles(tree);
}

function addDotnetProject(tree, schema) {
  addProjectConfiguration(tree, schema.name, {
    root: schema.dir,
    sourceRoot: schema.dir,
    targets: {
      build: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          cwd: schema.dir,
          command: 'dotnet build',
        },
      },
    },
  });
}
