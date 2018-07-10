module.exports = app => {
  const ctx = app.createAnonymousContext({});

  app.messenger.on('@@egg-mg/consumer', async ({ topic, consumer, payload }) => {
    const [service, method] = consumer.split('.');
    ctx.runInBackground(async () => {
      ctx.service[service][method](topic, payload);
    });
  });
};
