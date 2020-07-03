const core      = require('@actions/core');
const command   = require('./utils/commands');
const github    = require("@actions/github");
const utils     = require('./utils/utils');
const files     = require('./utils/changedfiles');

async function run (){

try{
    const context = github.context;
    const path = core.getInput('path-to-hcl');

    if(await files.changedFiles(path)){
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
            
                switch (context.eventName) {
                    case "pull_request_review":
                        command.runCmd("apply");
                        break;
                    case "pull_request":
                        command.runCmd("plan");
                        break;
                }
        }
    }
            
    } catch (error) {
        core.setFailed(error.message);
        cmdout = utils.formatOutput(error.message);
        utils.ghComment(cmdout);
    }

}

run();