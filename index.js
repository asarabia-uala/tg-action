const core      = require('@actions/core');
const tgplan    = require('../utils/tgplan.js')     

try{
    tgplan.runPlan();
    
} catch (error) {
    core.setFailed(error.message);
}