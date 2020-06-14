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

    tree = octokit.git.getTree({
        owner,
        ...context.repo,
        ...context.sha,
        recursive: "true"
      });
    console.log(tree);
            
}

module.exports = {
    printfiles
};