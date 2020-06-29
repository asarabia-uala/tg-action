const core          = require('@actions/core');
const github        = require('@actions/github');
const AWS           = require('aws-sdk');
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

async function bucketPlan(method){
    const bucket = 'uala-terragrunt-pr-action';
    const path = core.getInput('path-to-hcl');
    const prof = 'uala-operaciones';

    const credentials = new AWS.SharedIniFileCredentials({profile: prof});
    AWS.config.credentials = credentials;

    const s3 = new AWS.S3({apiVersion: '2006-03-01'});

    const sha     = github.context.sha;
    const repo   = github.context.payload.repository.name;

    const file = "./"+path+"tgplan.zip";

    const key = repo+"/"+sha+"/tgplan.zip";


    if(method == 'up'){
        const fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
        console.log('File Error', err);
        });
        let uploadParams = {Bucket: bucket, Key: key, Body: fileStream};
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            } if (data) {
                console.log("Upload Success", data.Location);
            }
        });
    }else{
        const params = { Bucket: bucket, Key: key };
        const fileStream = fs.createWriteStream(file);
        let s3Stream = await s3.getObject(params).createReadStream();

        s3Stream.on('error', function(err) {
            console.error(err);
        });

        await s3Stream.pipe(fileStream).on('error', function(err) {
            console.error('File Stream:', err);
        }).on('close', function() {
            console.log('Done.');
        });

    }
}

module.exports = {
    formatOutput,
    ghComment,
    bucketPlan
};

