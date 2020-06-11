const core          = require('@actions/core');

import {runPlan} from './utils/tgPlan.js';

try{
      runPlan();
    
} catch (error) {
    core.setFailed(error.message);
}