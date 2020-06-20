// External Dependencies
const fs     = require('fs');
const github = require('@actions/github');
const core   = require('@actions/core');

const context = github.context;
const repo    = context.payload.repository;
const owner   = repo.owner;

const FILES          = new Set();
const FILES_ADDED    = new Set();
const FILES_MODIFIED = new Set();
const FILES_REMOVED  = new Set();
const FILES_RENAMED  = new Set();

const gh   = github.getOctokit(core.getInput('github_token'));
const args = { owner: owner.name || owner.login, repo: repo.name };

function fetchCommitData(commit) {
	args.ref = commit.id || commit.sha;
	return gh.repos.getCommit(args);
}

function getCommits() {
	let commits;

	switch(context.eventName) {
		case 'push':
			commits = context.payload.commits;
		break;

		case 'pull_request':
			const url = context.payload.pull_request.commits_url;

            commits = gh.paginate(`GET ${url}`, args);
		break;

		default:
			commits = [];
		break;
	}

	return commits;
}

function isAdded(file) {
	return 'added' === file.status;
}

function isModified(file) {
	return 'modified' === file.status;
}

function isRemoved(file) {
	return 'removed' === file.status;
}

function isRenamed(file) {
	return 'renamed' === file.status;
}

function processCommitData(result) {
	debug('Processing API Response', result);

	if (! result || ! result.data) {
		return;
	}

	result.data.files.forEach(file => {
		(isAdded(file) || isModified(file) || isRenamed(file)) && FILES.add(file.filename);

		if (isAdded(file)) {
			FILES_ADDED.add(file.filename);
			FILES_REMOVED.delete(file.filename);

			return; // continue
		}

		if (isRemoved(file)) {
			if (! FILES_ADDED.has(file.filename)) {
				FILES_REMOVED.add(file.filename);
			}

			FILES_ADDED.delete(file.filename);
			FILES_MODIFIED.delete(file.filename);

			return; // continue;
		}

		if (isModified(file)) {
			FILES_MODIFIED.add(file.filename);

			return; // continue;
		}

		if (isRenamed(file)) {
			processRenamedFile(file.previous_filename, file.filename);
		}
	});
}

function processRenamedFile(prev_file, new_file) {
	FILES.delete(prev_file) && FILES.add(new_file);
	FILES_ADDED.delete(prev_file) && FILES_ADDED.add(new_file);
	FILES_MODIFIED.delete(prev_file) && FILES_MODIFIED.add(new_file);
	FILES_RENAMED.add(new_file);
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


function changedFiles(){

    let commits = getCommits();
    let result = new Set();
    // Exclude merge commits
    commits = commits.filter(c => ! c.parents || 1 === c.parents.length);

    if ('push' === context.eventName) {
        commits = commits.filter(c => c.distinct);
    }

    commits = commits.map(fetchCommitData());
    // commits.forEach(element => result.add(processCommitData(element)));

    // const result  = new Set();
    // let Files = Array.from(FILES.values());
    // Files.forEach(element => result.add(splitPath(element)));
    
    return commits;
}

  
module.exports = {
  changedFiles
};