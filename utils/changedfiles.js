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

    const {data: {tree: result1}} = await octokit.git.getTree({
        ...context.owner,
        ...context.repo,
        ...context.sha
     });

     console.log(`result1: ${result1.length}`)

}

module.exports = {
    printfiles
};