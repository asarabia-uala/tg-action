const core          = require('@actions/core');
const github        = require('@actions/github');
const aws           = require('aws-sdk');
const fs            = require('fs');
const path          = require('path');


function formatOutput(output){
    output = output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'');
    output = output.replace(/No changes. Infrastructure is up-to-date./g,"+ No changes. Infrastructure is up-to-date.");
    output = output.replace(/Refreshing state... /g,"");
    output = output.replace(/Error:/g,"- Error:"); 
    output = output.replace(/\  \-/g,"-");
    output = output.replace(/\  \+/g,"+");
    output = output.replace(/\  \~/g,"!");
    output = output.replace(/----/g,"####");
    output = "```diff\n".concat(output).concat("```");

    return  output;
}

function ghComment(tgOutput){
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
        body: tgOutput
    });
}

function bucketPlan(){
    const prof = core.getInput('aws-ops-profile-name');
    const bucket = core.getInput('tg-plan-bucket');
    const credentials = new AWS.SharedIniFileCredentials({profile: prof});
    AWS.config.credentials = credentials;

    const s3 = new aws.s3();
    // call S3 to retrieve upload file to specified bucket
    let uploadParams = {Bucket: bucket, Key: '', Body: ''};
    let file = tgplan.plan;

    // Configure the file stream and obtain the upload parameters
    let fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
    console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });

    s3.getObject(
        { Bucket: "my-bucket", Key: "my-picture.jpg" },
        function (error, data) {
          if (error != null) {
            alert("Failed to retrieve an object: " + error);
          } else {
            alert("Loaded " + data.ContentLength + " bytes");
            // do something with data.Body
          }
        }
    );
}



module.exports = {
    formatOutput,
    ghComment
};

