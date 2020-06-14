const github    = require("@actions/github");
const core      = require('@actions/core');

async function printfiles(){
    const myToken = core.getInput('github_token');
    const octokit = github.getOctokit(myToken)

    const context = github.context;

    if (context.payload.pull_request == null) {
        core.setFailed('No pull request found.');
        return;
    }

    let files = await octokit.git.getTree({
        ...context.owner,
        ...context.repo,
        ...context.sha,
        recursive: 1
     });
    
    console.log(files);

}

module.exports = {
    printfiles
};