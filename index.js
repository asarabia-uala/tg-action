const core          = require('@actions/core');
const github        = require('@actions/github');
const child_process = require('child_process');

try{
    
    const dir = core.getInput('path-to-hcl');

    let tgplan = child_process.execSync("terragrunt plan",{encoding: "utf8", cwd: dir });

    tgplan = formatPlan(tgplan);
  
    const myToken = core.getInput('github_token');
    const octokit = github.getOctokit(myToken)
  
    const context = github.context;
    if (context.payload.pull_request == null) {
        core.setFailed('No pull request found.');
        return;
    }
          
    const pull_request_number = context.payload.pull_request.number;
      
    const new_comment = octokit.issues.createComment({
        ...context.repo,
        issue_number: pull_request_number,
        body: tgplan
    });
      
    

} catch (error) {
    core.setFailed(error.message);
}

function formatPlan(planOutput){
    planOutput = planOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'');
    planOutput = planOutput.replace(/No changes. Infrastructure is up-to-date./g,"+ No changes. Infrastructure is up-to-date.");
    planOutput = planOutput.replace(/Refreshing state... /g,"");
    planOutput = planOutput.replace(/\  \-/g,"-");
    planOutput = planOutput.replace(/\  \+/g,"+");
    planOutput = planOutput.replace(/\  \~/g,"!");
    planOutput = planOutput.replace(/----/g,"####");
    planOutput = "```diff\n".concat(tgplan).concat("```");

    return  planOutput;
}


