const core          = require('@actions/core');
const github        = require('@actions/github');
const child_process = require('child_process');

try{
    
    const dir = core.getInput('path-to-hcl');

    let tgplan = child_process.execSync("terragrunt plan-all --terragrunt-non-interactive --terragrunt-source-update --terragrunt-include-external-dependencies -lock=false -out plan.out", {cwd: dir });

} catch (error) {
    core.setFailed(error.message);
}
