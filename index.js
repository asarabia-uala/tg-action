const core      = require('@actions/core');
const tgplan    = require('./utils/tgplan');
const github = require("@actions/github");

try{

    const context = github.context;

    switch (context.eventName) {
        case "issue_comment":

            const new_comment = octokit.issues.createComment({
                ...context.repo,
                issue_number: pull_request_number,
                body: "Apply 🚀"
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