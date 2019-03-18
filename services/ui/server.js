const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = dev ? 3003 : 3000;
const app = next({
  dev,
  dir: 'src'
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/projects', (req, res) => {
      app.render(req, res, '/projects');
    });

    server.get('/projects/:projectSlug', (req, res) => {
      app.render(req, res, '/project', { projectName: req.params.projectSlug });
    });

    server.get('/projects/:projectSlug/:environmentSlug', (req, res) => {
      app.render(req, res, '/environment', { openshiftProjectName: req.params.environmentSlug });
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:' + port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
