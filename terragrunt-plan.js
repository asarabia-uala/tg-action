/**
 * Wrapper around terragrunt to display output succinctly on Atlantis.
 *
 * Terragrunt is notoriously verbose, which can cause Atlantis to output
 * hundreds of comments on single PRs, which can be annoying.
 *
 * This script will output just the final plan for resources to update on
 * successful terragrunt runs, but will output all terragrunt output on
 * errors.
 */

const shell = require('shelljs');
const path = require('path');
const glob = require('@actions/glob');
const core = require('@actions/core');

/**
 * Promisifies shelljs.exec
 *
 * @param {string} command - Command to execute in the local shell
 */
async function run(command) {
  return new Promise((resolve) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Runs a plan via terragrunt. Output is only shown on error
 */
async function runPlan() {
  const dir = core.getInput('path-to-hcl');
  shell.cd(dir);
  const { code, stderr } = await run('terragrunt plan-all --terragrunt-non-interactive --terragrunt-source-update --terragrunt-include-external-dependencies -lock=false -out plan.out');
  if (code != 0) {
    console.log(stderr);
    throw Error(`Failed to run plan in ${shell.pwd()}`);
  }
}

/**
 * Searches in subdirectories of the current directory to find the plan file produced
 * by terraform.
 */
async function findPlanFile() {
  const patterns = ['**/plan.out'];
  const globber = await glob.create(patterns.join('\n'));
  const files = await globber.glob();

  if (files.length == 0) {
    throw Error(
      `Could not find plan file named plan.out under dir ${shell.pwd()}`,
    );
  }
  return files;
}

/**
 * Prints a representation of the terraform plan output to the console
 *
 * @param {array} files - name of the plan files to show the output of
 */
async function printPlanFile(files) {
  for (const file of files) {
    const { dir, base } = path.parse(file);
    shell.cd(dir);

    const { stdout } = await run(`terraform show ${base}`);  
    console.log(stdout);
  }
}

/**
 * Main function
 */
async function main() {
  await runPlan();
  const planFiles = await findPlanFile();
  await printPlanFile(planFiles);
}

/**
 * Run the program, exiting with a status code of 1 on any error
 */
main().catch((err) => {
  console.error(err);
  process.exit(1);
});