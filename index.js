const core          = require('@actions/core');
const github        = require('@actions/github');
const child_process = require('child_process');
import {runPlan} from '/utils/tgPlan.js';

try{
      runPlan();
    
} catch (error) {
    core.setFailed(error.message);
}