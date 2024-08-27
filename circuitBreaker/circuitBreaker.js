const CircuitBreaker = require("opossum");

function asyncFunctionThatCouldFail(x, y) {
    return new Promise((resolve, reject) => {
        // Do something, maybe on the network or a disk
    });
}

const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000, // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(2, 3).then(console.log).catch(console.error);

breaker.fallback;
