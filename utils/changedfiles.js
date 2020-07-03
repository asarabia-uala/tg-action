const github  = require('@actions/github');
const core    = require('@actions/core');

const context = github.context;
const repo    = context.payload.repository;
const owner   = repo.owner;
const FILES   = new Set();

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
			const purl = context.payload.pull_request.commits_url;
            commits = await gh.paginate(`GET ${purl}`, args);
		break;

		case 'pull_request_review':
			const pwurl = context.payload.pull_request.commits_url;
            commits = await gh.paginate(`GET ${pwurl}`, args);
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
		FILES.add(splitPath(file.filename));
	});
}

function splitPath(p) {
    var result = p.replace(/\\/g, "/").match(/(.*\/)?(\..*?|.*?)(\.[^.]*?)?(#.*$|\?.*$|$)/);
    return result[1];
}

async function changedFiles(path){
	if(path.charAt(path.length-1) != "/"){
        path = path+"/";
    }

    let commits = await getCommits();
    // Exclude merge commits
    commits = commits.filter(c => ! c.parents || 1 === c.parents.length);

    if ('push' === context.eventName) {
        commits = commits.filter(c => c.distinct);
    }

    const chDirs = await Promise.all(commits.map(fetchCommitData))
        .then(data => Promise.all(data.map(processCommitData)))
        .then(outputResults)
		.catch(err => core.error(err) && (process.exitCode = 1));
				
		return chDirs.includes(String(path));
		
}
  
module.exports = {
  changedFiles
};