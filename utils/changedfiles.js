// External Dependencies
const fs     = require('fs');
const github = require('@actions/github');
const core   = require('@actions/core');

const context = github.context;
const repo    = context.payload.repository;
const owner   = repo.owner;

const FILES          = new Set();

const gh   = github.getOctokit(core.getInput('github_token'));
const args = { owner: owner.name || owner.login, repo: repo.name };

function fetchCommitData(commit) {
	args.ref = commit.id || commit.sha;
    return gh.repos.getCommit(args);
}

async function getCommits() {
	let commits;

	switch(context.eventName) {
		case 'push':
			commits = context.payload.commits;
		break;

		case 'pull_request':
			const url = context.payload.pull_request.commits_url;

            commits = await gh.paginate(`GET ${url}`, args);
		break;

		default:
			commits = [];
		break;
	}

	return commits;
}


async function outputResults() {
    return Array.from(FILES.values());
}

function processCommitData(result) {

	if (! result || ! result.data) {
		return;
	}

	result.data.files.forEach(file => {
		FILES.add(file.filename);
	});
}

function processRenamedFile(prev_file, new_file) {
	FILES.delete(prev_file) && FILES.add(new_file);
}

function toJSON(value, pretty=true) {
	return pretty
		? JSON.stringify(value, null, 4)
		: JSON.stringify(value);
}

function splitPath(path) {
    var result = path.replace(/\\/g, "/").match(/(.*\/)?(\..*?|.*?)(\.[^.]*?)?(#.*$|\?.*$|$)/);
    return result[1];
}


async function changedFiles(){

    let commits = await getCommits();
    // Exclude merge commits
    commits = commits.filter(c => ! c.parents || 1 === c.parents.length);

    if ('push' === context.eventName) {
        commits = commits.filter(c => c.distinct);
    }

    const asyncRes = await Promise.all(commits.map(fetchCommitData))
        .then(data => Promise.all(data.map(processCommitData)))
        .then(outputResults)
		.catch(err => core.error(err) && (process.exitCode = 1));

    console.log(asyncRes);


    // var roots = commits.map(async function(commit) {
    //         let test = await fetchCommitData(commit);
    //         return test;
    // });

    // console.log(roots);
    // commits.forEach(async commit =>{ 




    //     let commits.map(
            
    //         await fetchCommitData(commit));
    // });

    // for(const commit in commits.values()){ 
    //     console.log(commit.sha);
    // }
    //console.log(commits[0].sha);
    //console.log(commits[0].id);


    // commits.forEach(element => result.add(processCommitData(element)));

    // const result  = new Set();
    // let Files = Array.from(FILES.values());
    // Files.forEach(element => result.add(splitPath(element)));
    
}

  
module.exports = {
  changedFiles
};