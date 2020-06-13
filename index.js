const core      = require('@actions/core');
const tgplan    = require('./utils/tgplan');
const github = require("@actions/github");

try{

    const context = github.context;

    switch (context.eventName) {
        case "pull_request_review":
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
                body: "Deploying Terraform Code, wait for the results... 🚀\n\n ![](https://i.imgur.com/NAcXVep.gif)"
            });
            break;
        case "@Apply":
            //Apply
            break;
    }

        
    //tgplan.runPlan();
    
} catch (error) {
    core.setFailed(error.message);
}