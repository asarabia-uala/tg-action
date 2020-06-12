const core      = require('@actions/core');
const tgplan    = require('./utils/tgplan');
const { context, GitHub } = require("@actions/github");

try{

    switch (context.eventName) {
        case "issue_comment":
            //
            await client.reactions.createForIssueComment({
                owner,
                repo,
                comment_id: context.payload.comment.id,
                content: "eyes"
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