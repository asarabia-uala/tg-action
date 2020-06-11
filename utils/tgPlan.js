const core          = require('@actions/core');
const github        = require('@actions/github');
const child_process = require('child_process');
import {formatPlan, ghComment} from '/utils/utils.js';

function runPlan(){
    const dir = core.getInput('path-to-hcl');

    let tgplan = child_process.execSync("terragrunt plan",{encoding: "utf8", cwd: dir });
    tgplan = formatPlan(tgplan);
    ghComment(tgplan);

}