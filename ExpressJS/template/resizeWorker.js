// Minimal placeholder worker for the /resize route.
// The existing app.js creates a piscina pool and a raw Worker pointing here,
// but resizeWorker.js was never present in the project, causing:
//   ERR_MODULE_NOT_FOUND: Cannot find module '.../resizeWorker.js'
// This stub handles both piscina (parentPort) and direct worker_threads usage.
const { parentPort, workerData } = require('worker_threads');

if (parentPort) {
  // piscina / worker_threads path: post the result back to the main thread.
  parentPort.postMessage({
    status: 'ok',
    message: 'resizeWorker placeholder',
    received: workerData,
  });
} else {
  // Fallback for direct require() usage.
  module.exports = async (data) => ({
    status: 'ok',
    message: 'resizeWorker placeholder',
    received: data,
  });
}
