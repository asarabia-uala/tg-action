const core          = require('@actions/core');
const github        = require('@actions/github');

function formatOutput(output){
    output = output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'');
    output = output.replace(/No changes. Infrastructure is up-to-date./g,"+ No changes. Infrastructure is up-to-date.");
    output = output.replace(/Refreshing state... /g,"");
    output = output.replace(/Error:/g,"- Error:"); 
    output = output.replace(/\  \-/g,"-");
    output = output.replace(/\  \+/g,"+");
    output = output.replace(/\  \~/g,"!");
    output = output.replace(/----/g,"####");
    output = "```diff\n".concat(output).concat("```");

    return  output;
}

function ghComment(tgOutput){
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
        body: tgOutput
    });
}

module.exports = {
    formatOutput,
    ghComment
};