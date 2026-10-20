// Worker for the /resize route.
// Used by the piscina pool in app.js (pool.run). piscina calls this exported
// function with the task data in a worker thread and resolves/rejects the
// returned promise based on the result, so worker errors never crash the main
// process. Replace the placeholder logic with a real image library (e.g.
// sharp) in production.
function resizeImage(data) {
  if (!data) {
    throw new Error('No image data provided to resize worker');
  }
  const inputLen = Buffer.isBuffer(data) ? data.length : String(data).length;
  return {
    status: 'ok',
    message: 'resize complete',
    inputSize: inputLen,
    outputSize: inputLen, // placeholder: no actual transformation yet
  };
}

module.exports = resizeImage;
