const writeComment = require('./github/write-comment');

const DEFAULT_COMMENT_FOR_INVALID_BRANCH_NAME = 'The name of this branch is not \n following the standards of this project!';
const DEFAULT_COMMENT_FOR_VALID_BRANCH_NAME = 'The name of this branch is fallowing \n the standards of this project!';
module.exports = async tools => {
  const branchPattern = /\D+-\d+/;
  const failIfInvalidBranchName = tools.inputs.fail_if_invalid_branch_name;
  //const ignoreBranchPattern = 'master|qa*|rel-*';
  var commentForInvalidBranchName = tools.inputs.comment_for_invalid_branch_name || DEFAULT_COMMENT_FOR_INVALID_BRANCH_NAME;
  var commentForValidBranchName = tools.inputs.comment_for_valid_branch_name || DEFAULT_COMMENT_FOR_VALID_BRANCH_NAME;
  const branchName = tools.context.payload.pull_request.title;
	tools.log.info(tools.context.payload.pull_request.title);
  const isValidBranchName = new RegExp(branchPattern).test(branchName);

/*  if (ignoreBranchPattern) {
    const isIgnoredBranch = new RegExp(ignoreBranchPattern).test(branchName);
    if (isIgnoredBranch) {
      tools.log.info('This PR should be ignored');
      return;
    }
  }*/

  if (isValidBranchName) {
    tools.log.info('This PR has valid subject');
	  commentForValidBranchName = 'The PR Subject ['+branchName+'] is fallowing SRE Dev standars!'
	await writeComment(tools, commentForValidBranchName);
    return;
  }

  tools.log.info('This PR has invalid subject');
commentForInvalidBranchName = 'The PR Subject ['+branchName+'] is not fallowing SRE Dev standars! Please check them here https://confluence.ncr.com/display/FSSRE/SRE+Development+Process'
  await writeComment(tools, commentForInvalidBranchName);

  if (failIfInvalidBranchName === 'true') {
    tools.exit.failure();
  }
};
