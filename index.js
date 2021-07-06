'use strict';
const minimist = require('minimist');
const getLatestPortfolioForToken = require('./src/question-2/get-latest-value-for-token');
const getLatestPortfolioValuePerToken = require('./src/question-2/get-latest-value-per-token');
const getValueForTokenAtGivenDate = require('./src/question-2/get-value-for-token-given-date');
const getValuePerTokenForGivenDate = require('./src/question-2/get-value-per-token-given-date');
const helpCommand = require('./help/help-command');

const argv = minimist(process.argv.splice(2));
if(argv.help){
    return helpCommand();
}

if (Object.keys(argv).length === 1) {
    return getLatestPortfolioValuePerToken();
} else if (argv.token && argv.date) {
    return getValueForTokenAtGivenDate(argv.token, argv.date);
} else if (argv.token) {
    return getLatestPortfolioForToken(argv.token);
} else if (argv.date) {
   return getValuePerTokenForGivenDate(argv.date);
} else {
    return helpCommand();
}
