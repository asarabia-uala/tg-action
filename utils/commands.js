const core          = require('@actions/core');
const child_process = require('child_process');
const utils         = require('./utils.js');

async function runCmd(command){
    const dir = core.getInput('path-to-hcl');
    let cmdout;
    try{
        switch(command){
            case "plan":
                cmdout = child_process.execSync("terragrunt plan-all --terragrunt-non-interactive --terragrunt-source-update --terragrunt-include-external-dependencies -out tgplan.plan",{encoding: "utf8", cwd: dir });
                child_process.execSync("zip tgplan.zip .terragrunt-cache/",{encoding: "utf8", cwd: dir });
                utils.bucketPlan('up');
                break;
            case "apply":
                utils.bucketPlan();
                child_process.execSync("unzip tgplan.zip",{encoding: "utf8", cwd: dir });
                cmdout = child_process.execSync("terragrunt apply-all --terragrunt-non-interactive --terragrunt-include-external-dependencies",{encoding: "utf8", cwd: dir });
                break;
        }

        cmdout = utils.formatOutput(cmdout);
        utils.ghComment(cmdout);
    }catch (error) {
        core.setFailed(error.message);
        cmdout = utils.formatOutput(error.message);
        utils.ghComment(cmdout);
    }
}

module.exports = {
   runCmd
};

