const core          = require('@actions/core');
const child_process = require('child_process');
const utils         = require('./utils.js');

function runApply(){
    const dir = core.getInput('path-to-hcl');

    let tgapply = child_process.execSync("terragrunt apply",{encoding: "utf8", cwd: dir });
    tgapply = utils.formatPlan(tgapply);
    utils.ghComment(tgapply);

}

module.exports = {
   runPlan
};

