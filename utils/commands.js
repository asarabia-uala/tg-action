const core          = require('@actions/core');
const child_process = require('child_process');
const utils         = require('./utils.js');

function runCmd(command){
    const dir = core.getInput('path-to-hcl');

    switch(command){
        case "plan":
            let cmdout = child_process.execSync("terragrunt plan-all --terragrunt-non-interactive --terragrunt-source-update --terragrunt-include-external-dependencies",{encoding: "utf8", cwd: dir });
            break;
        case "apply":
            let cmdout = child_process.execSync("terragrunt apply-all --terragrunt-non-interactive --terragrunt-include-external-dependencies",{encoding: "utf8", cwd: dir });
            break;
    }

    cmdout = utils.formatPlan(cmdout);
    utils.ghComment(cmdout);
}

module.exports = {
   runCmd
};

