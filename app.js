module.exports = app => {
  const ctx = app.createAnonymousContext({});

  app.messenger.on('@@egg-mg/queue', async ({ type, payload }) => {
    const [service, method] = type.split('.');
    ctx.runInBackground(async () => {
      ctx.service[service][method](payload);
    });
  });
};
