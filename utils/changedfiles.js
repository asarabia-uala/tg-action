const github    = require("@actions/github");
const core      = require('@actions/core');

function printfiles(){
    const myToken = core.getInput('github_token');
    const octokit = github.getOctokit(myToken)

    const context = github.context;

    if (context.payload.pull_request == null) {
        core.setFailed('No pull request found.');
        return;
    }

            
    const all       = {};

    const {data: {tree: result1}} = octokit.git.getTree({
        ...context.owner,
        ...context.repo,
        ...context.sha,
        recursive: 1
     });


   // const {data: {tree: result1}} = octokit.gitdata.getTree( { owner, repo, sha, recursive } );
    
    console.log(`result1: ${result1.length}`);

}

module.exports = {
    printfiles
};