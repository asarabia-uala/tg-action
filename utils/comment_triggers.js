const { context, GitHub } = require("@actions/github");
const tgplan    = require('./tgplan');


const body = context.eventName === "issue_comment" ? context.payload.comment.body : context.payload.pull_request.body;

if (context.eventName === "issue_comment" && !context.payload.issue.pull_request) {
    // not a pull-request comment, aborting
    return;
}

const client = new GitHub(GITHUB_TOKEN);

switch (body) {
    case "@Plan":
        tgplan.runPlan();
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