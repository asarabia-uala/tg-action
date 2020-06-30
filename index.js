const core      = require('@actions/core');
const command   = require('./utils/commands');
const github    = require("@actions/github");
const utils     = require('./utils/utils');
const files     = require('./utils/changedfiles');

try{
    const context = github.context;
    const path = core.getInput('path-to-hcl');

        if(core.getInput('comment') == 'true'){
            switch (context.eventName) {
                case "pull_request_review":
                    utils.ghComment("###  **[ Running Terragrunt Apply ... ]** :rocket:");
                    break;
                case "pull_request":
                    utils.ghComment("###  **[ Running Terragrunt Plan ... ]**  :mag_right: \n\n ![](https://i.imgur.com/OhxcU6J.gif)");
                    break;
            }
        }else{
            if(!files.changedFiles(path)){
                return;
            }

            switch (context.eventName) {
                case "pull_request_review":
                    command.runCmd("apply");
                    break;
                case "pull_request":
                    command.runCmd("plan");
                    break;
            }
        }
            
} catch (error) {
    core.setFailed(error.message);
    cmdout = utils.formatOutput(error.message);
    utils.ghComment(cmdout);
}

