const { createApp } = require('./app.cjs');

const port = Number(process.env.PORT || 3000);
const server = createApp().listen(port, () => {
  console.log(`Express API Reference Lab listening on http://localhost:${port}`);
});

function shutDown() {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.once('SIGINT', shutDown);
process.once('SIGTERM', shutDown);