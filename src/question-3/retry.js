const wait = ms => new Promise(r => setTimeout(r, ms));

const retry = (operation, delay, options) => new Promise((resolve, reject) => {
    // if options is not passed, set max key to 0
    if((options && !options.max) || !options ){
        options = {
            max: 0
        };
    }
    // first argument needs to be functions
    if(typeof operation !== 'function'){
        return reject(new Error('First argument is not a function'));
    }

    let result = operation();
    if (result) {
        return resolve(result);
    }
    if (retries > 0) {
        return wait(delay)
            .then(retry.bind(null, operation, delay, options.max - 1))
            .then(resolve);
    } else {
        return resolve(result);
    }
});

module.exports = retry;
