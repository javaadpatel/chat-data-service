const { parentPort, workerData } = require('worker_threads');

async function delay(ms) { 
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

async function handleMessage() {
  const { req, res } = workerData;
console.log("entered worker");
  // Handle the request logic here
  // ...
  await delay(10000);
  console.log("worker handleed");

  // Send the response back to the main thread
  parentPort.postMessage({ message: 'Request handled successfully' });
}

handleMessage();