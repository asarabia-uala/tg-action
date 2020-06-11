const core      = require('@actions/core');
const tgplan    = require('../tgplan.js');

try{
    tgplan.runPlan();
    
} catch (error) {
    core.setFailed(error.message);
}