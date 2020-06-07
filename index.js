const shell = require('shelljs');
const path  = require('path');
const glob  = require('@actions/glob');
const core  = require('@actions/core');

const command = core.getInput('tf_actions_subcommand');

switch (command) {
  case "init":
    shell.exec('./terragrunt-init.js')
    break;
  case "plan":
    shell.exec('./terragrunt-plan.js')
    break;
}