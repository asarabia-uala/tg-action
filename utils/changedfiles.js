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

    const owner = context.owner;
    const repo  = context.repo;
    const sha   = context.sha;
    const recursive = 0;
    const all ={}
    const {data: {tree: result1}} = octokit.gitdata.getTree( { owner, repo, sha, recursive } );

    console.log(`result1: ${result1.length}`);

}

module.exports = {
    printfiles
};