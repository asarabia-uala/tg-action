const core          = require('@actions/core');
const github        = require('@actions/github');
const child_process = require('child_process');

try{
    
    const dir = core.getInput('path-to-hcl');

    const tgplan = child_process.execSync("terragrunt plan-all --terragrunt-non-interactive --terragrunt-source-update --terragrunt-include-external-dependencies -lock=false -out plan.out",{encoding: "utf8"}, {cwd: dir });

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
