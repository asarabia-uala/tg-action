const core          = require('@actions/core');
const child_process = require('child_process');
const utils         = require('./utils.js');

function runPlan(){
    const dir = core.getInput('path-to-hcl');

    let tgplan = child_process.execSync("terragrunt plan",{encoding: "utf8", cwd: dir });
    tgplan = utils.formatPlan(tgplan);
    utils.ghComment(tgplan);

}

module.exports = {
   runPlan
};

