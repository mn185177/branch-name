require('dotenv').config();

const { Toolkit } = require('actions-toolkit');

const runAction = require('./src/run-action');
const validateParameters = require('./src/validations/validate-parameters');
const parametersSchema = require('./src/parameters-schema');

Toolkit.run(
  async tools => {
    tools.log.info('Validating parameters...');
    validateParameters(tools, parametersSchema);

    try {
      tools.log.info('Running the action...');
      await runAction(tools);
    } catch (error) {
      tools.log.info('Unexpected error happened when action was running: ', error);
    }
  },
  {
    event: [
      'pull_request.opened',
      'pull_request_target.opened',
      'pull_request_target.edited',
      'pull_request_target.reopened',
    ],
    secrets: ['GITHUB_TOKEN'],
  },
);
