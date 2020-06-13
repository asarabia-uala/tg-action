const core      = require('@actions/core');
const tgplan    = require('./utils/tgplan');
const github    = require("@actions/github");
const utils     = require('./utils/utils');


try{
    const context = github.context;
  
    if(core.getInput('comment') == 'true'){
        switch (context.eventName) {
            case "pull_request_review":
                utils.ghComment("Deploying Terraform Code, wait for the results... :rocket: \n\n ![](https://i.imgur.com/NAcXVep.gif)");
                break;
            case "pull_request":
                utils.ghComment("[ Running Terragrunt Plan ... ] :mag_right: \n\n ![](https://i.imgur.com/OhxcU6J.gif)");
                break;
        }
    }else{

        switch (context.eventName) {
            case "pull_request_review":
                tgplan.runPlan();
                break;
            case "pull_request":
                tgplan.runPlan();
                break;
        }
    }
            
} catch (error) {
    core.setFailed(error.message);
}

